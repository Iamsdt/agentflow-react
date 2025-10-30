# AgentFlow React

[![npm version](https://img.shields.io/npm/v/agentflow-react.svg)](https://www.npmjs.com/package/agentflow-react)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript/React client library for the **AgentFlow** multi-agent system API. Build conversational AI applications with streaming responses, tool execution, and dynamic state management.

## ✨ Features

- 🚀 **Simple API** - Clean, intuitive client for AgentFlow
- 💬 **Streaming Support** - Real-time streaming responses for chat UIs
- 🔧 **Tool Execution** - Automatic local tool execution with recursion handling
- 📊 **State Management** - Dynamic state schema with validation
- ⚛️ **React Ready** - Built for React applications with hooks and patterns
- 📘 **TypeScript First** - Full TypeScript support with comprehensive types
- 🎯 **Zero Config** - Works out of the box with sensible defaults

## 📦 Installation

```bash
npm install agentflow-react
# or
yarn add agentflow-react
# or
pnpm add agentflow-react
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { AgentFlowClient, Message } from 'agentflow-react';

// Initialize client
const client = new AgentFlowClient({
  baseUrl: 'http://localhost:8000',
  authToken: 'your-token', // optional
  debug: true              // optional
});

// Send a message and get response
const result = await client.invoke([
  Message.text_message('Hello, how can you help me?', 'user')
]);

console.log(result.messages); // Array of response messages
```

### Streaming Chat

```typescript
// Stream responses in real-time
const stream = client.stream([
  Message.text_message('Tell me a story', 'user')
]);

for await (const chunk of stream) {
  if (chunk.event === 'message') {
    console.log(chunk.message?.content);
  }
}
```

### React Integration

```typescript
import { useState } from 'react';
import { AgentFlowClient, Message } from 'agentflow-react';

function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const client = new AgentFlowClient({ baseUrl: 'http://localhost:8000' });

  const sendMessage = async (text: string) => {
    const userMsg = Message.text_message(text, 'user');
    setMessages(prev => [...prev, userMsg]);

    const result = await client.invoke([...messages, userMsg]);
    setMessages(result.messages);
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.content}</div>
      ))}
    </div>
  );
}
```

### Tool Registration

```typescript
// Register custom tools for agent execution
client.registerTool({
  node: 'assistant',
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string' }
    },
    required: ['location']
  },
  handler: async ({ location }) => {
    // Your tool logic here
    return { temperature: 72, conditions: 'sunny' };
  }
});

// Tools execute automatically during invoke
const result = await client.invoke([
  Message.text_message('What is the weather in NYC?', 'user')
]);
```

## 📚 Documentation

### Getting Started
- **[Getting Started Guide](docs/getting-started.md)** - Complete setup and first steps
- **[API Reference](docs/api-reference.md)** - Complete API documentation
- **[TypeScript Types](docs/typescript-types.md)** - Type definitions and usage

### Core Concepts
- **[Invoke API](docs/invoke-usage.md)** - Request/response pattern with tool execution
- **[Stream API](docs/stream-usage.md)** - Real-time streaming responses
- **[State Schema](docs/state-schema-guide.md)** - Dynamic state management and validation
- **[Tools Guide](docs/tools-guide.md)** - Tool registration and execution

### React Integration
- **[React Integration Guide](docs/react-integration.md)** - Hooks and patterns for React
- **[React Examples](docs/react-examples.md)** - Complete component examples

### Reference
- **[Quick References](docs/)** - Quick refs for stream and state schema APIs
- **[Troubleshooting](docs/troubleshooting.md)** - Common issues and solutions

## 🎯 Key APIs

### `invoke()` - Batch Processing
Execute agent with automatic tool execution loop:
```typescript
const result = await client.invoke(messages, {
  recursion_limit: 25,
  response_granularity: 'full'
});
```

### `stream()` - Real-time Streaming
Stream responses as they're generated:
```typescript
const stream = client.stream(messages);
for await (const chunk of stream) {
  // Process chunks in real-time
}
```

### `graphStateSchema()` - Dynamic Schema
Get agent state schema for form generation and validation:
```typescript
const schema = await client.graphStateSchema();
// Build forms, validate data, generate types
```

### Tool Registration
Register local tools that agents can execute:
```typescript
client.registerTool({
  node: 'node_name',
  name: 'tool_name',
  handler: async (args) => { /* ... */ }
});
```

## 💡 Examples

Check out the [`examples/`](examples/) directory for complete working examples:

- **[invoke-example.ts](examples/invoke-example.ts)** - Basic invoke with tool execution
- **[stream-example.ts](examples/stream-example.ts)** - Streaming responses
- **[state-schema-examples.ts](examples/state-schema-examples.ts)** - Form generation and validation
- **[react-chat-component.tsx](examples/react-chat-component.tsx)** - React chat UI
- **[react-form-builder.tsx](examples/react-form-builder.tsx)** - Dynamic form builder

## 🏗️ Architecture

```
┌─────────────────────┐
│   Your React App    │
└──────────┬──────────┘
           │
           │ AgentFlowClient
           ▼
┌─────────────────────┐
│  agentflow-react    │  ← This library
│  - Client           │
│  - Tools            │
│  - Messages         │
└──────────┬──────────┘
           │
           │ HTTP/HTTPS
           ▼
┌─────────────────────┐
│  AgentFlow Server   │  ← Your backend
│  (Multi-agent API)  │
└─────────────────────┘
```

## 🔧 Configuration

```typescript
const client = new AgentFlowClient({
  baseUrl: string,           // Required: API base URL
  authToken?: string,        // Optional: Bearer token
  timeout?: number,          // Optional: Request timeout (default: 5min)
  debug?: boolean            // Optional: Enable debug logging
});
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests once
npm run test:run

# Build the library
npm run build
```

## 📝 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  AgentFlowClient,
  Message,
  ToolRegistration,
  InvokeResult,
  StreamChunk,
  AgentState,
  AgentStateSchema
} from 'agentflow-react';
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/Iamsdt/agentflow-react/issues)
- 💬 [Discussions](https://github.com/Iamsdt/agentflow-react/discussions)

## 🙏 Acknowledgments

Built for the **AgentFlow** multi-agent system framework.

---

**Made with ❤️ for the AgentFlow community**
