import argparse
import json
from pathlib import Path
from process_data import ScreenplayProcessor
from query_handler import ScreenplayQueryHandler
from opensearchpy import OpenSearch

def inspect_files(screenplays_dir, metadata_path):
    """Helper function to inspect file structures"""
    print("=== METADATA INSPECTION ===")
    try:
        with open(metadata_path, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
        
        print(f"Metadata type: {type(metadata)}")
        
        if isinstance(metadata, dict) and 'movies' in metadata:
            movies_list = metadata['movies']
            print(f"Number of movies: {len(movies_list)}")
            
            if movies_list:
                print("First movie structure:", {k: type(v) for k, v in movies_list[0].items()})
                print("First movie keys:", list(movies_list[0].keys()))
                print("First movie_id:", movies_list[0].get('movie_id', 'Not found'))
                print("First title:", movies_list[0].get('title', 'Not found'))
                
                movies_with_id = [m for m in movies_list if 'movie_id' in m]
                print(f"Movies with movie_id: {len(movies_with_id)}/{len(movies_list)}")
        else:
            print("Unexpected metadata structure")
    except Exception as e:
        print(f"Error inspecting metadata: {e}")
    
    print("\n=== SCREENPLAY INSPECTION ===")
    screenplays_dir = Path(screenplays_dir)
    screenplay_files = list(screenplays_dir.glob("*.json"))
    
    if screenplay_files:
        print(f"Found {len(screenplay_files)} screenplay files")
        sample_file = screenplay_files[0]
        print(f"Sample file: {sample_file.name}")
        try:
            with open(sample_file, 'r', encoding='utf-8') as f:
                screenplay = json.load(f)
            print("Screenplay keys:", list(screenplay.keys()))
            if 'movie_id' in screenplay:
                print(f"Screenplay movie_id: {screenplay['movie_id']}")
            if 'dialogues' in screenplay:
                print(f"Number of dialogues: {len(screenplay['dialogues'])}")
                if screenplay['dialogues']:
                    print("First dialogue keys:", list(screenplay['dialogues'][0].keys()))
            if 'scenes' in screenplay:
                print(f"Number of scenes: {len(screenplay['scenes'])}")
        except Exception as e:
            print(f"Error inspecting screenplay: {e}")
    else:
        print("No screenplay files found!")

def check_movie_id_matching(screenplays_dir, metadata_path):
    """Check if movie_ids match between screenplays and metadata"""
    print("=== MOVIE ID MATCHING CHECK ===")
    
    with open(metadata_path, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    
    metadata_movies = {movie['movie_id']: movie for movie in metadata['movies'] if 'movie_id' in movie}
    print(f"Unique movie_ids in metadata: {len(metadata_movies)}")
    
    screenplays_dir = Path(screenplays_dir)
    screenplay_files = list(screenplays_dir.glob("*.json"))
    screenplay_movies = {}
    missing_metadata = []
    
    for file_path in screenplay_files[:10]:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                screenplay = json.load(f)
            movie_id = screenplay.get('movie_id')
            if movie_id:
                screenplay_movies[movie_id] = file_path.name
                if movie_id not in metadata_movies:
                    missing_metadata.append(movie_id)
        except Exception as e:
            print(f"Error reading {file_path.name}: {e}")
    
    print(f"Unique movie_ids in screenplays (sample): {len(screenplay_movies)}")
    print(f"Screenplay movie_ids missing metadata: {missing_metadata}")
    
    for movie_id in list(screenplay_movies.keys())[:3]:
        if movie_id in metadata_movies:
            print(f"✓ Match found: {movie_id} -> {metadata_movies[movie_id].get('title')}")
        else:
            print(f"✗ No match: {movie_id}")

def connect_opensearch(host, port, username, password, use_ssl=False):
    try:
        client = OpenSearch(
            hosts=[{"host": host, "port": port}],
            http_auth=(username, password),
            use_ssl=use_ssl,
            verify_certs=False,
            ssl_show_warn=False
        )
        if client.ping():
            print("✓ Successfully connected to OpenSearch!")
            return client
        else:
            print("✗ Could not connect to OpenSearch")
            return None
    except Exception as e:
        print(f"Connection error: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Screenplay Search System")
    parser.add_argument("--process", action="store_true", help="Process and index data")
    parser.add_argument("--search", type=str, help="Search query")
    parser.add_argument("--host", default="localhost")
    parser.add_argument("--port", type=int, default=9200)
    parser.add_argument("--username", default="admin")
    parser.add_argument("--password", default="admin")
    parser.add_argument("--ssl", action="store_true")
    parser.add_argument("--screenplays-dir")
    parser.add_argument("--metadata")
    parser.add_argument("--inspect", action="store_true")
    parser.add_argument("--check-matching", action="store_true")
    parser.add_argument("--test-connection", action="store_true")
    args = parser.parse_args()

    if any([args.process, args.search, args.inspect, args.check_matching]):
        if not args.screenplays_dir or not args.metadata:
            parser.error("--screenplays-dir and --metadata are required")

    if args.inspect:
        inspect_files(args.screenplays_dir, args.metadata)
        return

    if args.check_matching:
        check_movie_id_matching(args.screenplays_dir, args.metadata)
        return

    client = connect_opensearch(args.host, args.port, args.username, args.password, args.ssl)
    if not client:
        print("Cannot proceed without OpenSearch connection")
        return

    if args.test_connection:
        return

    if args.process:
        processor = ScreenplayProcessor(args.screenplays_dir, args.metadata)
        # Check if index exists
        if not client.indices.exists(index="movies_with_scenes"):
            client.indices.create(index="movies_with_scenes")

        documents = processor.process_screenplays()
        if documents:
            print(f"Indexing {len(documents)} documents...")
            for doc in documents:
                client.index(index="movies_with_scenes", id=doc.get("movie_id"), body=doc)
            print("✅ Indexing completed.")
        else:
            print("No documents to index")

    if args.search:
        handler = ScreenplayQueryHandler(
            host=args.host,
            port=args.port,
            username=args.username,
            password=args.password,
            use_ssl=args.ssl
        )
        results = handler.search_screenplays(args.search)
        formatted = handler.format_results(results, args.search)
        print(formatted)

if __name__ == "__main__":
    main()
