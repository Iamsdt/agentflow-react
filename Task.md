Task: Lets integrate Threads Details
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
  'http://127.0.0.1:8000/v1/threads/5' \
  -H 'accept: application/json'

Input list message object with config


Response:
{
  "data": {
    "thread_data": {
      "thread": {
        "thread_id": "5",
        "thread_name": null,
        "user_id": null,
        "metadata": null,
        "updated_at": null,
        "run_id": null
      }
    }
  },
  "metadata": {
    "request_id": "9925ae58-d83d-4cbb-bc1b-ac048bd4a9b3",
    "timestamp": "2025-10-26T01:21:30.488167",
    "message": "OK"
  }
}

For this example few values are null but in real scenario they will have values.
it could be string, number, object etc.