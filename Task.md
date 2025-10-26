Task: Lets integrate memory threads api into our codebase.
Steps:
1. Checking existing codebase all the api in a separate folder named endpoints
2. Create a new files and write api logic there
3. Now connect that api with client file
4. Export types from index file
5. Write tests for the new api
6. Run all tests to make sure nothing is broken
7. Update check.ts file to include the new api


Here is the api:
curl -X 'POST' \
  'http://127.0.0.1:8000/v1/store/search' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "config": {},
  "options": {},
  "query": "string",
  "memory_type": "episodic",
  "category": "string",
  "limit": 10,
  "score_threshold": 0,
  "filters": {},
  "retrieval_strategy": "similarity",
  "distance_metric": "cosine",
  "max_tokens": 4000
}'

class RetrievalStrategy(Enum):
    """Memory retrieval strategies."""

    SIMILARITY = "similarity"  # Vector similarity search
    TEMPORAL = "temporal"  # Time-based retrieval
    RELEVANCE = "relevance"  # Relevance scoring
    HYBRID = "hybrid"  # Combined approaches
    GRAPH_TRAVERSAL = "graph_traversal"  # Knowledge graph navigation

    

class DistanceMetric(Enum):
    """Supported distance metrics for vector similarity."""

    COSINE = "cosine"
    EUCLIDEAN = "euclidean"
    DOT_PRODUCT = "dot_product"
    MANHATTAN = "manhattan"


class MemoryType(Enum):
    """Types of memories that can be stored."""

    EPISODIC = "episodic"  # Conversation memories
    SEMANTIC = "semantic"  # Facts and knowledge
    PROCEDURAL = "procedural"  # How-to knowledge
    ENTITY = "entity"  # Entity-based memories
    RELATIONSHIP = "relationship"  # Entity relationships
    CUSTOM = "custom"  # Custom memory types
    DECLARATIVE = "declarative"  # Explicit facts and events


Response:
{
  "data": {
    "results": [
      {
        "id": "string",
        "content": "",
        "score": 0,
        "memory_type": "episodic",
        "metadata": {},
        "vector": [
          0
        ],
        "user_id": "string",
        "thread_id": "string",
        "timestamp": "2025-10-26T06:59:08.624Z"
      }
    ]
  },
  "metadata": {
    "message": "Success",
    "request_id": "50009c49f05241938ce738a2199cd38a",
    "timestamp": "2025-10-26T12:51:13.040424"
  }
}