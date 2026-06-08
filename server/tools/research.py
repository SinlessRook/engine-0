import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.tavily_client import tavily_client

def research_on_topic(topic_name):
    """
    Queries Tavily to find recent software engineering interview trends 
    and documentation context for a specific topic.
    """
    if not tavily_client:
        raise ValueError("Tavily client is not configured. Check TAVILY_API_KEY.")
        
    query = f"{topic_name} technical interview preparation guide trends"
    
    try:
        # Execute an optimized advanced search
        response = tavily_client.search(
            query=query,
            search_depth="advanced",
            max_results=5
        )
        results = response.get("results", [])
        
        parsed_insights = []
        for result in results:
            parsed_insights.append({
                "title": result.get("title"),
                "url": result.get("url"),
                "snippet": result.get("content")
            })
            
        return {
            "topic": topic_name,
            "insights": parsed_insights
        }
    except Exception as e:
        print(f"Error during research on topic '{topic_name}': {e}")
        return {
            "topic": topic_name,
            "insights": []
        }

if __name__ == "__main__":
    topic = "sliding window technique"
    insights = research_on_topic(topic)
    print(f"Research Insights for '{topic}':")
    for idx, insight in enumerate(insights["insights"], 1):
        print(f"{idx}. {insight['title']} - {insight['url']}")
        print(f"   Snippet: {insight['snippet']}\n")