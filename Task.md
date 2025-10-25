Task: Lets integrate Thread Delete
Steps:
1. Checking existing codebase all the api in a separate folder named endpoints
2. Create a new files and write api logic there
3. Now connect that api with client file
4. Export types from index file
5. Write tests for the new api
6. Run all tests to make sure nothing is broken
7. Update check.ts file to include the new api


Here is the api:
curl -X 'GET' \
  'http://127.0.0.1:8000/v1/threads?search=s&offset=0&limit=10' \
  -H 'accept: application/json'



Response:
{
  "data": {
    "threads": [
      {
        "thread_id": "5",
        "thread_name": null,
        "user_id": null,
        "metadata": null,
        "updated_at": null,
        "run_id": null
      }
    ]
  },
  "metadata": {
    "request_id": "76794838-1a00-4a0b-8a7e-d2247b1cccef",
    "timestamp": "2025-10-26T01:38:12.094988",
    "message": "OK"
  }
}

For this example few values are null but in real scenario they will have values.
it could be string, number, object etc.