# State Schema API - Quick Reference

## What is it?

The State Schema API (`GET /v1/graph:StateSchema`) returns the **complete JSON Schema definition** for the `AgentState` object. It tells you:
- What fields exist
- What type each field is
- What values fields accept
- What the default values are
- Which fields are required
- Field descriptions

## Basic Usage

```typescript
import { AgentFlowClient } from 'agentflow-react';

const client = new AgentFlowClient({
  baseUrl: 'https://api.example.com',
  authToken: 'your-token'
});

// Get the schema
const response = await client.graphStateSchema();
const schema = response.data;

// Explore fields
Object.entries(schema.properties).forEach(([name, field]) => {
  console.log(`${name}: ${field.type} (${field.description})`);
  console.log(`  Default: ${field.default}`);
});
```

## Response Structure

```typescript
{
  data: {
    title: "AgentState",
    description: "...",
    type: "object",
    properties: {
      // Core fields
      context: { type: "array", ... },
      context_summary: { type: ["string", "null"], ... },
      execution_meta: { type: "object", ... },
      
      // Dynamic fields (varies by config)
      cv_text: { type: "string", default: "", ... },
      cid: { type: "string", default: "", ... },
      // ... more dynamic fields
    },
    required: ["context", "execution_meta"]
  },
  metadata: {
    request_id: "...",
    timestamp: "...",
    message: "OK"
  }
}
```

## Field Schema Properties

```typescript
{
  type: "string" | "number" | "integer" | "boolean" | "array" | "object" | "null",
  description: "Human-readable description",
  default: any,           // Default value if not provided
  items: {...},           // For array: schema of items
  properties: {...},      // For object: properties schema
  required: [...],        // For object: required property names
  enum: [...],           // Allowed values
  anyOf: [...],          // Can be any of these types
  $ref: "...",          // Reference to another schema
}
```

## Common Use Cases

### 1️⃣ Display Field Info
```typescript
const schema = await client.graphStateSchema();

schema.data.properties.forEach(([name, field]) => {
  console.log(`📌 ${name}`);
  console.log(`   Type: ${field.type}`);
  console.log(`   Description: ${field.description}`);
  console.log(`   Default: ${field.default}`);
});
```

### 2️⃣ Build a Form
```typescript
const fields = Object.entries(schema.data.properties)
  .map(([name, field]) => ({
    name,
    type: field.type === 'array' ? 'multi' : field.type,
    label: field.description || name,
    required: schema.data.required?.includes(name),
    defaultValue: field.default
  }));

// Use fields to render form UI
renderForm(fields);
```

### 3️⃣ Validate Data
```typescript
function isValidAgentState(data) {
  const schema = await client.graphStateSchema();
  
  // Check required fields
  for (const fieldName of schema.data.required || []) {
    if (!(fieldName in data)) {
      return false;
    }
  }
  
  // Check field types
  for (const [fieldName, value] of Object.entries(data)) {
    const fieldSchema = schema.data.properties[fieldName];
    if (fieldSchema?.type === 'string' && typeof value !== 'string') {
      return false;
    }
  }
  
  return true;
}
```

### 4️⃣ List Dynamic Fields
```typescript
const schema = await client.graphStateSchema();
const coreFields = ['context', 'context_summary', 'execution_meta'];

const dynamicFields = Object.keys(schema.data.properties)
  .filter(name => !coreFields.includes(name));

console.log('Dynamic fields:', dynamicFields);
```

## Core Fields (Always Present)

| Field | Type | Purpose |
|-------|------|---------|
| `context` | array | List of context items |
| `context_summary` | string \| null | Summary of context |
| `execution_meta` | object | Execution metadata (current_node, step, etc.) |

## Dynamic Fields (Varies by Configuration)

Common examples:
- `cv_text`: Candidate CV content (string)
- `cid`: Candidate ID (string)
- `jd_text`: Job description (string)
- `jd_id`: Job description ID (string)

## Type Examples

### String Field
```typescript
{
  type: "string",
  description: "CV content",
  default: "",
  // Can also have: enum, minLength, maxLength, pattern, format
}
```

### Array Field
```typescript
{
  type: "array",
  description: "List of items",
  items: { type: "object", properties: {...} },
  default: []
}
```

### Object Field
```typescript
{
  type: "object",
  description: "Execution metadata",
  properties: {
    current_node: { type: "string" },
    step: { type: "integer" }
  },
  required: ["current_node", "step"]
}
```

### Union Type
```typescript
{
  anyOf: [
    { type: "string" },
    { type: "null" }
  ],
  default: null
}
```

## Error Handling

```typescript
try {
  const schema = await client.graphStateSchema();
  // Use schema
} catch (error) {
  if (error.message.includes('timeout')) {
    console.error('Request timed out');
  } else if (error.message.includes('HTTP')) {
    console.error('Server error:', error.message);
  } else {
    console.error('Network error:', error.message);
  }
}
```

## Type Definitions

```typescript
import type {
  StateSchemaResponse,
  AgentStateSchema,
  FieldSchema
} from 'agentflow-react';

const response: StateSchemaResponse = await client.graphStateSchema();
const schema: AgentStateSchema = response.data;
const field: FieldSchema = schema.properties.context;
```

## Real-World Example

```typescript
import { AgentFlowClient } from 'agentflow-react';

async function setupForm() {
  const client = new AgentFlowClient({
    baseUrl: 'https://api.example.com'
  });
  
  // Get schema
  const { data: schema } = await client.graphStateSchema();
  
  // Build form configuration
  const formConfig = {
    title: schema.title,
    description: schema.description,
    fields: Object.entries(schema.properties).map(([name, field]) => ({
      name,
      type: field.type,
      label: field.description || name,
      required: schema.required?.includes(name),
      defaultValue: field.default,
      placeholder: `Enter ${name}`
    }))
  };
  
  return formConfig;
}
```

## Links

- 📖 [Full Guide](./state-schema-guide.md)
- 💡 [Examples](../examples/state-schema-examples.ts)
- 🔍 [Implementation Details](./state-schema-implementation.md)
- 🔄 [Direction Change](./DIRECTION_CHANGE.md)

## Key Takeaways

✅ Schema is **self-documenting** - contains all field information
✅ **No guessing** - know exact types and constraints upfront
✅ **Extensible** - supports dynamic fields from configuration
✅ **Type-safe** - use schema to validate and generate types
✅ **User-friendly** - build better UIs and validation
