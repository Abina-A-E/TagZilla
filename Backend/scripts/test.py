from opensearchpy import OpenSearch

# ---------- OpenSearch connection ----------
HOST = "localhost"
PORT = 9200
USERNAME = "admin"
PASSWORD = "StrongPassword@123"
USE_SSL = True
INDEX_NAME = "screenplays"

client = OpenSearch(
    hosts=[{"host": HOST, "port": PORT}],
    http_auth=(USERNAME, PASSWORD),
    use_ssl=USE_SSL,
    verify_certs=False,
    ssl_show_warn=False
)

if not client.ping():
    print("✗ Could not connect to OpenSearch")
    exit(1)

print("✓ Connected to OpenSearch")

# ---------- Input dialogue ----------
dialogue_query = input("Enter dialogue text to search: ").strip()
if not dialogue_query:
    print("Please enter a valid dialogue")
    exit(1)

# ---------- Search ----------
search_body = {
    "query": {
        "multi_match": {
            "query": dialogue_query,
            "fields": ["screenplay_data^3", "combined_text^2", "title^5", "cast^2"],
            "fuzziness": "AUTO"
        }
    },
    "highlight": {
        "fields": {
            "screenplay_data": {},
            "combined_text": {}
        }
    },
    "size": 5  # Return top 5 matches
}

try:
    response = client.search(index=INDEX_NAME, body=search_body)
except Exception as e:
    print(f"Search error: {e}")
    exit(1)

# ---------- Display results ----------
hits = response.get("hits", {}).get("hits", [])
if not hits:
    print("No movies found for this dialogue.")
else:
    print(f"\nTop {len(hits)} movies for the dialogue:\n")
    for i, hit in enumerate(hits, 1):
        source = hit["_source"]
        title = source.get("title", "Unknown Title")
        imdb_id = source.get("imdb_id", "N/A")
        cast = source.get("cast", [])
        score = hit.get("_score", 0.0)

        print(f"{i}. {title}")
        print(f"   IMDb ID: {imdb_id}")
        print(f"   Cast: {', '.join(cast) if cast else 'N/A'}")
        print(f"   Score: {score:.2f}")

        # Show matched dialogues (highlighted)
        highlight = hit.get("highlight", {})
        if highlight:
            print("   Matching dialogue(s):")
            for field in ["screenplay_data", "combined_text"]:
                if field in highlight:
                    for hl in highlight[field][:3]:  # Show first 3 matches
                        clean_hl = hl.replace("<em>", "*").replace("</em>", "*")
                        print(f"     - {clean_hl}")
        print()
