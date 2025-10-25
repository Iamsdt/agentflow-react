Task: Lets integrate Threads apis
Steps:
1. Checking existing codebase all the api in a seperate folder named endpoints
2. Create a new files and write api logic there
3. Now connect that api with client file
4. Export types from index file
5. Write tests for the new api
6. Run all tests to make sure nothing is broken
7. Update check.ts file to include the new api


Here is the api:
curl -X 'DELETE' \
  'http://127.0.0.1:8000/v1/threads/5/messages/58788989' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "config": {}
}'

Input list message object with config


Response:
{
  "data": {
    "success": true,
    "message": "string",
    "data": {}
  },
  "metadata": {
    "message": "Success",
    "request_id": "f2e2147709b64caca391441256666d68",
    "timestamp": "2025-10-26T00:44:22.910508"
  }
}
