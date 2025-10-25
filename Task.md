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
curl -X 'POST' \
  'http://127.0.0.1:8000/v1/threads/5/messages' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "config": {},
  "messages": [
    {
      "message_id": "string",
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "string",
          "annotations": [
            {
              "url": "string",
              "file_id": "string",
              "page": 0,
              "index": 0,
              "title": "string"
            }
          ]
        },
        {
          "type": "image",
          "media": {
            "kind": "url",
            "url": "string",
            "file_id": "string",
            "data_base64": "string",
            "mime_type": "string",
            "size_bytes": 0,
            "sha256": "string",
            "filename": "string",
            "width": 0,
            "height": 0,
            "duration_ms": 0,
            "page": 0
          },
          "alt_text": "string",
          "bbox": [
            0
          ]
        },
        {
          "type": "audio",
          "media": {
            "kind": "url",
            "url": "string",
            "file_id": "string",
            "data_base64": "string",
            "mime_type": "string",
            "size_bytes": 0,
            "sha256": "string",
            "filename": "string",
            "width": 0,
            "height": 0,
            "duration_ms": 0,
            "page": 0
          },
          "transcript": "string",
          "sample_rate": 0,
          "channels": 0
        },
        {
          "type": "video",
          "media": {
            "kind": "url",
            "url": "string",
            "file_id": "string",
            "data_base64": "string",
            "mime_type": "string",
            "size_bytes": 0,
            "sha256": "string",
            "filename": "string",
            "width": 0,
            "height": 0,
            "duration_ms": 0,
            "page": 0
          },
          "thumbnail": {
            "kind": "url",
            "url": "string",
            "file_id": "string",
            "data_base64": "string",
            "mime_type": "string",
            "size_bytes": 0,
            "sha256": "string",
            "filename": "string",
            "width": 0,
            "height": 0,
            "duration_ms": 0,
            "page": 0
          }
        },
        {
          "type": "document",
          "media": {
            "kind": "url",
            "url": "string",
            "file_id": "string",
            "data_base64": "string",
            "mime_type": "string",
            "size_bytes": 0,
            "sha256": "string",
            "filename": "string",
            "width": 0,
            "height": 0,
            "duration_ms": 0,
            "page": 0
          },
          "pages": [
            0
          ],
          "excerpt": "string"
        },
        {
          "type": "data",
          "mime_type": "string",
          "data_base64": "string",
          "media": {
            "kind": "url",
            "url": "string",
            "file_id": "string",
            "data_base64": "string",
            "mime_type": "string",
            "size_bytes": 0,
            "sha256": "string",
            "filename": "string",
            "width": 0,
            "height": 0,
            "duration_ms": 0,
            "page": 0
          }
        },
        {
          "type": "tool_call",
          "id": "string",
          "name": "string",
          "args": {},
          "tool_type": "string"
        },
        {
          "type": "remote_tool_call",
          "id": "string",
          "name": "string",
          "args": {},
          "tool_type": "remote"
        },
        {
          "type": "tool_result",
          "call_id": "string",
          "output": "string",
          "is_error": false,
          "status": "completed"
        },
        {
          "type": "reasoning",
          "summary": "string",
          "details": [
            "string"
          ]
        },
        {
          "type": "annotation",
          "kind": "citation",
          "refs": [
            {
              "url": "string",
              "file_id": "string",
              "page": 0,
              "index": 0,
              "title": "string"
            }
          ],
          "spans": [
            [
              null,
              null
            ]
          ]
        },
        {
          "type": "error",
          "message": "string",
          "code": "string",
          "data": {}
        }
      ],
      "delta": false,
      "tools_calls": [
        {}
      ],
      "reasoning": "string",
      "timestamp": 0,
      "metadata": {},
      "usages": {
        "completion_tokens": 0,
        "prompt_tokens": 0,
        "total_tokens": 0,
        "reasoning_tokens": 0,
        "cache_creation_input_tokens": 0,
        "cache_read_input_tokens": 0,
        "image_tokens": 0,
        "audio_tokens": 0
      },
      "raw": {}
    }
  ],
  "metadata": {}
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
