# Graph State Schema API

This endpoint retrieves the common Agent state schema used by the graph runtime.

- HTTP: GET /v1/graph:StateSchema
- Library method: `AgentFlowClient.graphStateSchema()`
- Response shape: `{ data: AgentStateSchema, metadata: ResponseMetadata }`

## Usage

```ts
import { AgentFlowClient, AgentState } from '../src';

const client = new AgentFlowClient({ baseUrl: 'http://127.0.0.1:8000', debug: true });
const res = await client.graphStateSchema();
console.log(res.metadata.message);           // "OK"
console.log(res.data.context.length);        // 0 (empty array)
console.log(res.data.context_summary);       // null
console.log(res.data.execution_meta.current_node); // "START"
```

## cURL

```bash
curl -X 'GET' \
  'http://127.0.0.1:8000/v1/graph:StateSchema' \
  -H 'accept: application/json'
```

## Types

```ts
export interface StateSchemaResponse {
  data: AgentState;            // AgentState instance with default values
  metadata: ResponseMetadata;  // { request_id: string; timestamp: string; message: string }
}

export class AgentState {
  context: Message[] = [];
  context_summary: string | null = null;
  execution_meta: ExecutionMeta = new DefaultExecutionMeta();

  constructor(initialData: Partial<Record<string, any>> = {})
}
```

Notes:
- The API internally fetches a JSON Schema but converts it to an `AgentState` instance for easier usage.
- Returns an `AgentState` object with default values based on the schema structure.
- The `AgentState` class is defined in `src/agent.ts` and represents the actual agent state structure.
- `context` contains an array of `Message` objects, `execution_meta` tracks execution state.
- Users work directly with the `AgentState` instance without needing to parse JSON Schema.
