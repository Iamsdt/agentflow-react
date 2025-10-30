# Getting Started with AgentFlow React

Welcome! This guide will help you get up and running with **AgentFlow React** in about 15 minutes.

## 📋 Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- Basic knowledge of TypeScript/JavaScript
- Familiarity with React (for React examples)
- Access to an AgentFlow backend server

## 📦 Installation

Install the library using your preferred package manager:

```bash
npm install agentflow-react
# or
yarn add agentflow-react
# or
pnpm add agentflow-react
```

## 🚀 First Steps

### 1. Import and Initialize Client

```typescript
import { AgentFlowClient, Message } from 'agentflow-react';

// Create a client instance
const client = new AgentFlowClient({
  baseUrl: 'http://localhost:8000',  // Your AgentFlow server URL
  authToken: 'your-token',           // Optional: Bearer token for authentication
  timeout: 300000,                    // Optional: Request timeout (default: 5min)
  debug: true                         // Optional: Enable debug logging
});
```

### 2. Make Your First API Call - Ping

Test connectivity with a simple ping:

```typescript
// Check if server is reachable
const pingResult = await client.ping();
console.log(pingResult.data.status); // "pong"
console.log(pingResult.metadata.message); // "OK"
```

### 3. Send a Message with Invoke

Use the `invoke()` method for standard request/response:

```typescript
// Send a user message
const result = await client.invoke([
  Message.text_message('Hello! How can you help me?', 'user')
]);

// Access the response
console.log(result.messages); // Array of Message objects
console.log(result.iterations); // Number of tool execution loops
console.log(result.meta.thread_id); // Thread identifier
```

**Output:**
```typescript
{
  messages: [
    { role: 'user', content: 'Hello! How can you help me?' },
    { role: 'assistant', content: 'I can help you with...' }
  ],
  iterations: 1,
  recursion_limit_reached: false,
  meta: { thread_id: '...', run_id: '...', ... }
}
```

### 4. Stream Real-time Responses

For chat UIs, use streaming for real-time responses:

```typescript
// Create a stream
const stream = client.stream([
  Message.text_message('Tell me a story', 'user')
]);

// Process chunks as they arrive
for await (const chunk of stream) {
  if (chunk.event === 'message') {
    console.log(`${chunk.message?.role}: ${chunk.message?.content}`);
  }
}
```

## 🔧 Working with Tools

Tools allow agents to execute functions on your client.

### Register a Tool

```typescript
// Register a simple calculator tool
client.registerTool({
  node: 'assistant',
  name: 'add_numbers',
  description: 'Add two numbers together',
  parameters: {
    type: 'object',
    properties: {
      a: { type: 'number', description: 'First number' },
      b: { type: 'number', description: 'Second number' }
    },
    required: ['a', 'b']
  },
  handler: async ({ a, b }) => {
    return { result: a + b };
  }
});
```

### Use the Tool

```typescript
// The agent will automatically call the tool
const result = await client.invoke([
  Message.text_message('What is 5 + 3?', 'user')
]);

// Tool executes automatically, response includes the answer
console.log(result.messages);
// [
//   { role: 'user', content: 'What is 5 + 3?' },
//   { role: 'assistant', content: 'The answer is 8' }
// ]
```

### How Tool Execution Works

1. Client sends message → Server responds with tool call request
2. Client executes registered tool locally
3. Client sends tool result back to server
4. Server processes result and responds
5. Repeats until no more tool calls (up to recursion limit)

## 📊 Get State Schema

Retrieve the agent's state schema for dynamic forms and validation:

```typescript
const schemaResponse = await client.graphStateSchema();
const schema = schemaResponse.data;

// Explore available fields
Object.entries(schema.properties).forEach(([fieldName, fieldSchema]) => {
  console.log(`${fieldName}: ${fieldSchema.type}`);
  console.log(`  Description: ${fieldSchema.description}`);
  console.log(`  Default: ${fieldSchema.default}`);
});
```

**Use cases:**
- Generate dynamic forms
- Validate user input
- Create TypeScript types
- Build documentation

## ⚛️ React Integration

### Basic Chat Component

```typescript
import { useState } from 'react';
import { AgentFlowClient, Message } from 'agentflow-react';

function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize client
  const client = new AgentFlowClient({
    baseUrl: 'http://localhost:8000'
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = Message.text_message(input, 'user');
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Get agent response
      const result = await client.invoke([...messages, userMsg]);
      setMessages(result.messages);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        disabled={loading}
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}

export default ChatComponent;
```

### Streaming Chat Component

```typescript
import { useState } from 'react';
import { AgentFlowClient, Message, StreamChunk } from 'agentflow-react';

function StreamingChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);

  const client = new AgentFlowClient({
    baseUrl: 'http://localhost:8000'
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = Message.text_message(input, 'user');
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setStreaming(true);

    try {
      const stream = client.stream([...messages, userMsg]);
      
      for await (const chunk of stream) {
        if (chunk.event === 'message' && chunk.message) {
          // Update messages in real-time
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg?.role === chunk.message?.role) {
              // Update existing message
              return [...prev.slice(0, -1), chunk.message];
            } else {
              // Add new message
              return [...prev, chunk.message];
            }
          });
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div>
      {/* Similar UI as above */}
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg.content}</div>
        ))}
        {streaming && <div>Typing...</div>}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

## 🎯 Common Patterns

### Pattern 1: Simple API Call

```typescript
const result = await client.invoke([
  Message.text_message('Hello', 'user')
]);
```

### Pattern 2: Conversational Context

```typescript
// Maintain conversation history
const history = [
  Message.text_message('What is 2 + 2?', 'user'),
  Message.text_message('4', 'assistant'),
  Message.text_message('What about 5 + 3?', 'user')
];

const result = await client.invoke(history);
```

### Pattern 3: With Configuration

```typescript
const result = await client.invoke(messages, {
  recursion_limit: 10,              // Max tool execution loops
  response_granularity: 'low',      // Minimal response data
  initial_state: {},                 // Initial agent state
  config: {}                         // Graph configuration
});
```

### Pattern 4: Error Handling

```typescript
try {
  const result = await client.invoke(messages);
  console.log(result.messages);
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('timeout')) {
      console.error('Request timed out');
    } else if (error.message.includes('HTTP')) {
      console.error('Server error:', error.message);
    } else {
      console.error('Network error:', error.message);
    }
  }
}
```

## 🐛 Debugging

Enable debug mode to see detailed logs:

```typescript
const client = new AgentFlowClient({
  baseUrl: 'http://localhost:8000',
  debug: true  // 👈 Enables console logging
});
```

**Debug output includes:**
- API requests and responses
- Tool executions
- Iteration progress
- Error details

## 📚 Next Steps

Now that you've completed the basics, explore these topics:

### Essential Reading
1. **[API Reference](./api-reference.md)** - Complete method documentation
2. **[React Integration](./react-integration.md)** - Advanced React patterns and hooks
3. **[React Examples](./react-examples.md)** - Complete component examples

### Deep Dives
4. **[Invoke API Guide](./invoke-usage.md)** - Detailed invoke documentation
5. **[Stream API Guide](./stream-usage.md)** - Comprehensive streaming guide
6. **[Tools Guide](./tools-guide.md)** - Master tool registration and execution
7. **[State Schema Guide](./state-schema-guide.md)** - Dynamic forms and validation

### Reference
8. **[TypeScript Types](./typescript-types.md)** - Type definitions
9. **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions

## 💡 Quick Tips

- ✅ Use `invoke()` for standard request/response patterns
- ✅ Use `stream()` for real-time chat interfaces
- ✅ Enable `debug: true` during development
- ✅ Register tools before calling `invoke()` or `stream()`
- ✅ Handle errors with try-catch blocks
- ✅ Use TypeScript for better IntelliSense and type safety
- ✅ Check `result.recursion_limit_reached` if tools loop unexpectedly
- ✅ Explore the `/examples` folder for complete working code

## 🆘 Need Help?

- 📖 Check the [API Reference](./api-reference.md)
- 💡 Review [React Examples](./react-examples.md)
- 🐛 See [Troubleshooting Guide](./troubleshooting.md)
- 🔍 Search [GitHub Issues](https://github.com/Iamsdt/agentflow-react/issues)

## ✨ Example Projects

Browse complete examples in the `/examples` directory:

- `invoke-example.ts` - Basic invoke usage
- `stream-example.ts` - Streaming responses
- `state-schema-examples.ts` - Form generation
- `react-chat-component.tsx` - React chat UI
- `react-form-builder.tsx` - Dynamic forms

---

**Congratulations!** 🎉 You're now ready to build with AgentFlow React!

Continue with [React Integration](./react-integration.md) for React-specific patterns, or dive into [API Reference](./api-reference.md) to explore all available methods.
