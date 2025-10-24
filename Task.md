Task: Lets intrgeate Checkpoint apis
Steps:
1. Checking existing codebase all the api in a seperate folder named endpoints
2. Create a new files and write api logic there
3. Now connect that api with client file
4. Export types from index file
5. Write tests for the new api
6. Run all tests to make sure nothing is broken
7. Update check.ts file to include the new api


Here is the api:
curl -X 'PUT' \
  'http://127.0.0.1:8000/v1/threads/5/state' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "config": {},
  "state": {}
}'

Node config is a map and state is AgentState object

Response:
{
  "data": {
    "state": {
      "context": [
        {
          "message_id": "82549b0c-dd9b-4756-a303-ea0ea6c9be3b",
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "HI",
              "annotations": []
            }
          ],
          "delta": false,
          "tools_calls": null,
          "reasoning": null,
          "timestamp": 1761290526.29568,
          "metadata": {},
          "usages": null,
          "raw": null
        },
        {
          "message_id": "Hin7aLyROPup1e8P5J69qQQ",
          "role": "assistant",
          "content": [
            {
              "type": "text",
              "text": "Hi, how can I help you today?\n",
              "annotations": []
            }
          ],
          "delta": false,
          "tools_calls": null,
          "reasoning": "",
          "timestamp": 1761290526,
          "metadata": {
            "provider": "litellm",
            "model": "gemini-2.0-flash-exp",
            "finish_reason": "stop",
            "object": "chat.completion",
            "prompt_tokens_details": {
              "audio_tokens": null,
              "cached_tokens": null,
              "text_tokens": 59,
              "image_tokens": null
            },
            "completion_tokens_details": null
          },
          "usages": {
            "completion_tokens": 10,
            "prompt_tokens": 59,
            "total_tokens": 69,
            "reasoning_tokens": 0,
            "cache_creation_input_tokens": 0,
            "cache_read_input_tokens": 0,
            "image_tokens": 0,
            "audio_tokens": 0
          },
          "raw": {
            "id": "Hin7aLyROPup1e8P5J69qQQ",
            "created": 1761290526,
            "model": "gemini-2.0-flash-exp",
            "object": "chat.completion",
            "system_fingerprint": null,
            "choices": [
              {
                "finish_reason": "stop",
                "index": 0,
                "message": {
                  "content": "Hi, how can I help you today?\n",
                  "role": "assistant",
                  "tool_calls": null,
                  "function_call": null,
                  "images": [],
                  "thinking_blocks": []
                }
              }
            ],
            "usage": {
              "completion_tokens": 10,
              "prompt_tokens": 59,
              "total_tokens": 69,
              "completion_tokens_details": null,
              "prompt_tokens_details": {
                "audio_tokens": null,
                "cached_tokens": null,
                "text_tokens": 59,
                "image_tokens": null
              }
            },
            "vertex_ai_grounding_metadata": [],
            "vertex_ai_url_context_metadata": [],
            "vertex_ai_safety_results": [],
            "vertex_ai_citation_metadata": []
          }
        }
      ],
      "context_summary": null,
      "cv_text": "",
      "cid": "",
      "jd_text": "",
      "jd_id": ""
    }
  },
  "metadata": {
    "request_id": "97160711-b1d1-41d9-bd8e-e2a84269e855",
    "timestamp": "2025-10-24T13:31:21.225194",
    "message": "OK"
  }
}