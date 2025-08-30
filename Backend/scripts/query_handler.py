from opensearch_client import OpenSearchClient

class ScreenplayQueryHandler:
    def __init__(self, host='localhost', port=9200, username='admin', password='StrongPassword@123', use_ssl=True):
        self.opensearch = OpenSearchClient(host, port, username, password, use_ssl,  verify_certs=False,
    ssl_show_warn=False)
    
    def search_screenplays(self, query, index_name="screenplays"):
        response = self.opensearch.search(query, index_name)
        
        if not response or 'hits' not in response:
            return []
        
        results = []
        for hit in response['hits']['hits']:
            source = hit['_source']
            highlight = hit.get('highlight', {})
            
            result = {
                'movie_id': source['movie_id'],
                'title': source['title'],
                'year': source.get('year', ''),
                'directors': source.get('directors', ''),
                'imdb_rating': source.get('imdb_rating', 0.0),
                'score': hit['_score'],
                'highlights': highlight
            }
            results.append(result)
        
        return results
    
    def format_results(self, results, query):
        if not results:
            return "No results found for your query."
        
        output = [f"Search results for: '{query}'\n"]
        output.append(f"Found {len(results)} results\n")
        
        for i, result in enumerate(results, 1):
            output.append(f"{i}. {result['title']} ({result['year']}) - IMDb: {result['imdb_rating']}")
            output.append(f"   Director: {result['directors']}")
            output.append(f"   Score: {result['score']:.2f}")
            
            # Show highlights from screenplay
            if 'highlights' in result:
                for field in ['screenplay_data', 'combined_text']:
                    if field in result['highlights']:
                        highlights = result['highlights'][field][:2]  # Show first 2 highlights
                        output.append(f"   Highlights from {field}:")
                        for hl in highlights:
                            # Clean up highlighting tags
                            clean_hl = hl.replace('<em>', '*').replace('</em>', '*')
                            output.append(f"     - {clean_hl}")
                        break
            
            output.append("")
        
        return "\n".join(output)