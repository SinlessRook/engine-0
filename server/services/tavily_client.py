import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

tavily_key = os.getenv("TAVILY_API_KEY")
tavily_client = TavilyClient(api_key=tavily_key) if tavily_key else None

if __name__ == "__main__":
    # Test execution
    query = "sliding window technique interview guide"
    
    if tavily_client:
        try:
            # FIX: Drop restrictive subdomains, look up across general domains, or allow broad search
            response = tavily_client.search(
                query=query,
                search_depth="advanced",
                max_results=3
            )
            
            results = response.get("results", [])
            parsed_resources = []
            
            for result in results:
                parsed_resources.append({
                    "title": result.get("title"),
                    "url": result.get("url"),
                    "snippet": result.get("content")
                })
                
            print("Tavily SDK Search Results (Fixed):")
            print(parsed_resources)
            
        except Exception as e:
            print(f"Error fetching resources: {e}")
    else:
        print("TAVILY_API_KEY not configured.")