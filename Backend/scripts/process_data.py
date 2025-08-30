import json
import os
from pathlib import Path
from tqdm import tqdm
from opensearch_client import OpenSearchClient

class ScreenplayProcessor:
    def __init__(self, screenplays_dir, metadata_path):
        self.screenplays_dir = Path(screenplays_dir)
        self.metadata_path = Path(metadata_path)
        self.metadata = self._load_metadata()
    
    def _load_metadata(self):
        try:
            with open(self.metadata_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            print(f"Metadata type: {type(data)}")
            
            # Based on your structure, it's a dictionary with "movies" key
            if isinstance(data, dict) and 'movies' in data:
                print("Metadata has 'movies' array")
                movies_list = data['movies']
                # Create mapping by movie_id
                return {movie['movie_id']: movie for movie in movies_list if 'movie_id' in movie}
            else:
                print("Unexpected metadata structure")
                return {}
                
        except Exception as e:
            print(f"Error loading metadata: {e}")
            return {}
    
    def _process_screenplay_file(self, file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                screenplay_data = json.load(f)
            
            # Extract movie_id from the screenplay
            movie_id = screenplay_data.get('movie_id')
            if not movie_id:
                print(f"No movie_id found in {file_path.name}")
                return None
            
            if movie_id not in self.metadata:
                print(f"Movie ID {movie_id} not found in metadata for file {file_path.name}")
                return None
            
            metadata = self.metadata[movie_id]
            
            # Extract screenplay text from dialogues
            screenplay_text = self._extract_screenplay_text(screenplay_data)
            
            # Prepare the document for OpenSearch
            document = {
                "movie_id": str(movie_id),
                "title": metadata.get('title', 'Unknown Title'),
                "imdb_id": metadata.get('imdb_id', ''),
                "imdb_rating": float(metadata.get('imdb_rating', 0.0)),
                "year": metadata.get('year', ''),
                "cast": metadata.get('cast', []),
                "directors": metadata.get('directors', ''),
                "writers": metadata.get('writers', ''),
                "genres": metadata.get('genres', ''),
                "plot": metadata.get('plot', ''),
                "screenplay_data": screenplay_text,
                "combined_text": self._create_combined_text(metadata, screenplay_text)
            }
            
            return document
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            return None
    
    def _extract_screenplay_text(self, screenplay_data):
        """Extract text from screenplay dialogues"""
        text_parts = []
        
        # Extract from dialogues
        if 'dialogues' in screenplay_data:
            for dialogue in screenplay_data['dialogues']:
                speaker = dialogue.get('speaker', 'Unknown')
                text = dialogue.get('text', '')
                if text and len(text) > 3:  # Filter out very short texts
                    text_parts.append(f"{speaker}: {text}")
        
        # Extract from scenes if needed
        if 'scenes' in screenplay_data:
            for scene in screenplay_data['scenes']:
                location = scene.get('location', '')
                if location and len(location) > 3:
                    text_parts.append(f"[Scene: {location}]")
        
        return " ".join(text_parts)
    
    def _create_combined_text(self, metadata, screenplay_text):
        """Create a combined text field for better search"""
        combined = []
        
        # Add metadata fields
        combined.append(metadata.get('title', ''))
        combined.append(metadata.get('directors', ''))
        combined.append(metadata.get('writers', ''))
        combined.append(metadata.get('genres', ''))
        combined.append(metadata.get('plot', ''))
        
        # Add cast
        if 'cast' in metadata:
            combined.extend(metadata['cast'])
        
        # Add screenplay text
        combined.append(screenplay_text)
        
        return " ".join(combined)
    
    def process_screenplays(self):
        screenplay_files = list(self.screenplays_dir.glob("*.json"))
        documents = []
        processed_count = 0
        error_count = 0
        
        print(f"Found {len(screenplay_files)} screenplay files")
        print(f"Loaded metadata for {len(self.metadata)} movies")
        
        # Show first few metadata keys for debugging
        if self.metadata:
            sample_keys = list(self.metadata.keys())[:3]
            print(f"Sample movie IDs in metadata: {sample_keys}")
            
            # Show structure of first metadata item
            first_key = sample_keys[0]
            first_movie = self.metadata[first_key]
            print(f"Movie title for {first_key}: {first_movie.get('title', 'Unknown')}")
        
        for file_path in tqdm(screenplay_files, desc="Processing screenplays"):
            document = self._process_screenplay_file(file_path)
            if document:
                documents.append(document)
                processed_count += 1
            else:
                error_count += 1
        
        print(f"Successfully processed {processed_count} files, {error_count} errors")
        return documents