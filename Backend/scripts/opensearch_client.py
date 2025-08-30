from opensearchpy import OpenSearch, exceptions
import time

class OpenSearchClient:
    def __init__(self, host='localhost', port=9200, username='admin', password='StrongPassword@123', use_ssl=True):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.use_ssl = use_ssl
        
        # Initialize client but don't connect yet
        self.client = None
        self.connected = False
    
    def connect(self, max_retries=5, retry_delay=2):
        """Establish connection to OpenSearch with retries"""
        for attempt in range(max_retries):
            try:
                self.client = OpenSearch(
                    hosts=[{'host': self.host, 'port': self.port}],
                    http_auth=(self.username, self.password),
                    use_ssl=self.use_ssl,
                    verify_certs=False,
                    timeout=30,
                    max_retries=3,
                    retry_on_timeout=True
                )
                
                # Test the connection
                if self.client.ping():
                    self.connected = True
                    print(f"Successfully connected to OpenSearch at {self.host}:{self.port}")
                    return True
                else:
                    print(f"Connection test failed (attempt {attempt + 1}/{max_retries})")
                    
            except exceptions.ConnectionError as e:
                print(f"Connection error (attempt {attempt + 1}/{max_retries}): {e}")
            except Exception as e:
                print(f"Unexpected error connecting to OpenSearch (attempt {attempt + 1}/{max_retries}): {e}")
            
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
        
        print("Failed to connect to OpenSearch after multiple attempts")
        return False
    
    def create_index(self, index_name="screenplays"):
        if not self.connected and not self.connect():
            return False
            
        index_body = {
            "settings": {
                "index": {
                    "number_of_shards": 1,
                    "number_of_replicas": 1
                },
                "analysis": {
                    "analyzer": {
                        "screenplay_analyzer": {
                            "type": "custom",
                            "tokenizer": "standard",
                            "filter": ["lowercase", "asciifolding"]
                        }
                    }
                }
            },
            "mappings": {
                "properties": {
                    "movie_id": {"type": "keyword"},
                    "title": {
                        "type": "text",
                        "analyzer": "screenplay_analyzer",
                        "fields": {"keyword": {"type": "keyword"}}
                    },
                    "imdb_id": {"type": "keyword"},
                    "imdb_rating": {"type": "float"},
                    "year": {"type": "keyword"},
                    "cast": {
                        "type": "text",
                        "analyzer": "screenplay_analyzer",
                        "fields": {"keyword": {"type": "keyword"}}
                    },
                    "directors": {
                        "type": "text",
                        "analyzer": "screenplay_analyzer",
                        "fields": {"keyword": {"type": "keyword"}}
                    },
                    "writers": {
                        "type": "text",
                        "analyzer": "screenplay_analyzer"
                    },
                    "genres": {
                        "type": "text",
                        "analyzer": "screenplay_analyzer",
                        "fields": {"keyword": {"type": "keyword"}}
                    },
                    "plot": {
                        "type": "text",
                        "analyzer": "screenplay_analyzer"
                    },
                    "screenplay_data": {
                        "type": "text",
                        "analyzer": "screenplay_analyzer"
                    },
                    "combined_text": {
                        "type": "text",
                        "analyzer": "screenplay_analyzer"
                    }
                }
            }
        }
        
        try:
            if not self.client.indices.exists(index=index_name):
                self.client.indices.create(index=index_name, body=index_body)
                print(f"Index {index_name} created successfully")
            else:
                print(f"Index {index_name} already exists")
            return True
        except Exception as e:
            print(f"Error creating index: {e}")
            return False
    
    def index_document(self, document, index_name="screenplays"):
        if not self.connected and not self.connect():
            return None
            
        try:
            response = self.client.index(
                index=index_name,
                body=document,
                id=document['movie_id'],
                refresh=True
            )
            return response
        except Exception as e:
            print(f"Error indexing document: {e}")
            return None
    
    def search(self, query, index_name="screenplays"):
        if not self.connected and not self.connect():
            return None
            
        search_body = {
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": [
                        "title^5", 
                        "screenplay_data^3", 
                        "combined_text^2", 
                        "cast^2", 
                        "directors^2",
                        "genres^2",
                        "plot"
                    ],
                    "fuzziness": "AUTO"
                }
            },
            "highlight": {
                "fields": {
                    "screenplay_data": {},
                    "title": {},
                    "combined_text": {}
                }
            }
        }
        
        try:
            response = self.client.search(
                index=index_name,
                body=search_body
            )
            return response
        except Exception as e:
            print(f"Search error: {e}")
            return None
    
    def bulk_index(self, documents, index_name="screenplays"):
        if not self.connected and not self.connect():
            return None
            
        bulk_body = []
        for doc in documents:
            bulk_body.append({"index": {"_index": index_name, "_id": doc['movie_id']}})
            bulk_body.append(doc)
        
        try:
            response = self.client.bulk(body=bulk_body, refresh=True)
            if response['errors']:
                print("Some documents failed to index")
                error_count = 0
                for item in response['items']:
                    if 'error' in item['index']:
                        error_count += 1
                        if error_count <= 5:  # Show first 5 errors
                            print(f"Error with doc {item['index']['_id']}: {item['index']['error']}")
                print(f"Total errors: {error_count}")
            return response
        except Exception as e:
            print(f"Bulk index error: {e}")
            return None