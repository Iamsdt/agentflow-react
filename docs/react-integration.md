# React Integration Guide

This guide shows you how to integrate **AgentFlow Client** into your React applications with best practices, custom hooks, and common patterns.

## 📦 Installation

```bash
npm install @10xscale/agentflow-client react
```

## 🎯 Core Concepts

### Client Initialization

The `AgentFlowClient` should be initialized once and shared across your application.

**❌ Don't create new clients in every component:**
```typescript
function MyComponent() {
  // DON'T DO THIS - creates new client on every render
  const client = new AgentFlowClient({ baseUrl: 'http://localhost:8000' });
  // ...
}
```

**✅ Do create client once and reuse:**
```typescript
// Option 1: Module-level singleton
// utils/agentflow.ts
export const agentFlowClient = new AgentFlowClient({
  baseUrl: process.env.REACT_APP_AGENTFLOW_URL || 'http://localhost:8000'
});

// MyComponent.tsx
import { agentFlowClient } from './utils/agentflow';
```

## 🏗️ Context Provider Pattern

The recommended approach is to use React Context to provide the client throughout your app.

### Step 1: Create AgentFlow Context

```typescript
// contexts/AgentFlowContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { AgentFlowClient } from '@10xscale/agentflow-client';

interface AgentFlowContextType {
  client: AgentFlowClient;
}

const AgentFlowContext = createContext<AgentFlowContextType | undefined>(undefined);

interface AgentFlowProviderProps {
  children: ReactNode;
  baseUrl: string;
  authToken?: string;
  debug?: boolean;
}

export function AgentFlowProvider({
  children,
  baseUrl,
  authToken,
  debug = false
}: AgentFlowProviderProps) {
  // Create client once
  const client = React.useMemo(
    () => new AgentFlowClient({ baseUrl, authToken, debug }),
    [baseUrl, authToken, debug]
  );

  return (
    <AgentFlowContext.Provider value={{ client }}>
      {children}
    </AgentFlowContext.Provider>
  );
}

export function useAgentFlow() {
  const context = useContext(AgentFlowContext);
  if (!context) {
    throw new Error('useAgentFlow must be used within AgentFlowProvider');
  }
  return context.client;
}
```

### Step 2: Wrap Your App

```typescript
// App.tsx
import { AgentFlowProvider } from './contexts/AgentFlowContext';

function App() {
  return (
    <AgentFlowProvider
      baseUrl={process.env.REACT_APP_AGENTFLOW_URL || 'http://localhost:8000'}
      authToken={process.env.REACT_APP_AUTH_TOKEN}
      debug={process.env.NODE_ENV === 'development'}
    >
      <YourApp />
    </AgentFlowProvider>
  );
}
```

### Step 3: Use in Components

```typescript
// components/Chat.tsx
import { useAgentFlow } from '../contexts/AgentFlowContext';

function Chat() {
  const client = useAgentFlow();
  
  const sendMessage = async (text: string) => {
    const result = await client.invoke([/* ... */]);
    // ...
  };
  
  return <div>{/* ... */}</div>;
}
```

## 🪝 Custom Hooks

### useInvoke Hook

Manage invoke requests with loading and error states:

```typescript
// hooks/useInvoke.ts
import { useState } from 'react';
import { Message, InvokeResult } from '@10xscale/agentflow-client';
import { useAgentFlow } from '../contexts/AgentFlowContext';

interface UseInvokeOptions {
  recursion_limit?: number;
  response_granularity?: 'full' | 'partial' | 'low';
}

export function useInvoke(options: UseInvokeOptions = {}) {
  const client = useAgentFlow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<InvokeResult | null>(null);

  const invoke = async (messages: Message[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await client.invoke(messages, options);
      setResult(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return {
    invoke,
    loading,
    error,
    result,
    reset
  };
}
```

**Usage:**
```typescript
function ChatComponent() {
  const { invoke, loading, error, result } = useInvoke({
    recursion_limit: 10,
    response_granularity: 'low'
  });

  const sendMessage = async (text: string) => {
    try {
      await invoke([Message.text_message(text, 'user')]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {result && <div>{/* Display messages */}</div>}
    </div>
  );
}
```

### useStream Hook

Handle streaming responses with real-time updates:

```typescript
// hooks/useStream.ts
import { useState, useCallback } from 'react';
import { Message, StreamChunk } from '@10xscale/agentflow-client';
import { useAgentFlow } from '../contexts/AgentFlowContext';

interface UseStreamOptions {
  onChunk?: (chunk: StreamChunk) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export function useStream(options: UseStreamOptions = {}) {
  const client = useAgentFlow();
  const [streaming, setStreaming] = useState(false);
  const [chunks, setChunks] = useState<StreamChunk[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const startStream = useCallback(async (messages: Message[]) => {
    setStreaming(true);
    setError(null);
    setChunks([]);

    try {
      const stream = client.stream(messages, {
        response_granularity: 'low'
      });

      for await (const chunk of stream) {
        setChunks(prev => [...prev, chunk]);
        options.onChunk?.(chunk);
      }
      
      options.onComplete?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Stream error');
      setError(error);
      options.onError?.(error);
    } finally {
      setStreaming(false);
    }
  }, [client, options]);

  const reset = useCallback(() => {
    setChunks([]);
    setError(null);
    setStreaming(false);
  }, []);

  return {
    startStream,
    streaming,
    chunks,
    error,
    reset
  };
}
```

**Usage:**
```typescript
function StreamingChat() {
  const { startStream, streaming, chunks, error } = useStream({
    onChunk: (chunk) => console.log('New chunk:', chunk),
    onComplete: () => console.log('Stream complete')
  });

  const sendMessage = (text: string) => {
    startStream([Message.text_message(text, 'user')]);
  };

  const messages = chunks
    .filter(chunk => chunk.event === 'message')
    .map(chunk => chunk.message)
    .filter(Boolean);

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.content}</div>
      ))}
      {streaming && <div>Streaming...</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
```

### useStateSchema Hook

Fetch and cache state schema for form generation:

```typescript
// hooks/useStateSchema.ts
import { useState, useEffect } from 'react';
import { AgentStateSchema } from '@10xscale/agentflow-client';
import { useAgentFlow } from '../contexts/AgentFlowContext';

export function useStateSchema() {
  const client = useAgentFlow();
  const [schema, setSchema] = useState<AgentStateSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchSchema = async () => {
      try {
        const response = await client.graphStateSchema();
        if (mounted) {
          setSchema(response.data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch schema'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSchema();

    return () => {
      mounted = false;
    };
  }, [client]);

  return { schema, loading, error };
}
```

**Usage:**
```typescript
function DynamicForm() {
  const { schema, loading, error } = useStateSchema();

  if (loading) return <div>Loading schema...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!schema) return null;

  return (
    <form>
      {Object.entries(schema.properties).map(([name, field]) => (
        <div key={name}>
          <label>{field.description || name}</label>
          <input
            type={field.type === 'number' ? 'number' : 'text'}
            defaultValue={field.default}
          />
        </div>
      ))}
    </form>
  );
}
```

### useMessages Hook

Manage conversation message history:

```typescript
// hooks/useMessages.ts
import { useState, useCallback } from 'react';
import { Message } from '@10xscale/agentflow-client';

export function useMessages(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addMessages = useCallback((newMessages: Message[]) => {
    setMessages(prev => [...prev, ...newMessages]);
  }, []);

  const replaceMessages = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const updateLastMessage = useCallback((updater: (msg: Message) => Message) => {
    setMessages(prev => {
      if (prev.length === 0) return prev;
      return [...prev.slice(0, -1), updater(prev[prev.length - 1])];
    });
  }, []);

  return {
    messages,
    addMessage,
    addMessages,
    replaceMessages,
    clearMessages,
    updateLastMessage
  };
}
```

**Usage:**
```typescript
function Chat() {
  const { messages, addMessage, replaceMessages } = useMessages();
  const { invoke } = useInvoke();

  const sendMessage = async (text: string) => {
    const userMsg = Message.text_message(text, 'user');
    addMessage(userMsg);

    const result = await invoke([...messages, userMsg]);
    replaceMessages(result.messages);
  };

  return <div>{/* Render messages */}</div>;
}
```

## 🎨 Component Patterns

### Loading States

```typescript
function Chat() {
  const { invoke, loading } = useInvoke();

  return (
    <div>
      {loading && (
        <div className="loading-indicator">
          <span>Thinking...</span>
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
```

### Error Handling

```typescript
function Chat() {
  const { invoke, error } = useInvoke();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  }, [error]);

  return (
    <div>
      {showError && (
        <div className="error-banner">
          <span>Error: {error?.message}</span>
          <button onClick={() => setShowError(false)}>×</button>
        </div>
      )}
    </div>
  );
}
```

### Streaming with Visual Feedback

```typescript
function StreamingMessage({ chunk }: { chunk: StreamChunk }) {
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={isNew ? 'message fade-in' : 'message'}>
      {chunk.message?.content}
    </div>
  );
}
```

### Tool Execution Indicator

Show when the agent is executing remote tools (client-side only).

**⚠️ Note:** This only applies to remote tools registered client-side. Backend tools (defined in Python) execute on the server and aren't visible here.

```typescript
function Chat() {
  const { messages } = useMessages();
  const [executingTools, setExecutingTools] = useState(false);

  useEffect(() => {
    // Check if last message contains tool calls
    const lastMsg = messages[messages.length - 1];
    const hasToolCalls = lastMsg?.content?.some(
      (block: any) => block.type === 'remote_tool_call'
    );
    setExecutingTools(hasToolCalls || false);
  }, [messages]);

  return (
    <div>
      {executingTools && (
        <div className="tool-indicator">
          🔧 Executing tools...
        </div>
      )}
    </div>
  );
}
```

## 🔐 Authentication

### Token from Environment

```typescript
// AgentFlowProvider with env token
<AgentFlowProvider
  baseUrl={process.env.REACT_APP_AGENTFLOW_URL!}
  authToken={process.env.REACT_APP_AUTH_TOKEN}
>
  <App />
</AgentFlowProvider>
```

### Token from Auth Hook

```typescript
function App() {
  const { token } = useAuth(); // Your auth hook

  return (
    <AgentFlowProvider
      baseUrl="http://localhost:8000"
      authToken={token}
    >
      <YourApp />
    </AgentFlowProvider>
  );
}
```

### Dynamic Token Updates

```typescript
// Context with token updates
export function AgentFlowProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  
  const client = useMemo(() => {
    return new AgentFlowClient({
      baseUrl: 'http://localhost:8000',
      authToken: token
    });
  }, [token]); // Recreate client when token changes

  return (
    <AgentFlowContext.Provider value={{ client }}>
      {children}
    </AgentFlowContext.Provider>
  );
}
```

## 🧪 Testing

### Mock Client for Tests

```typescript
// __mocks__/@10xscale/agentflow-client.ts
export class AgentFlowClient {
  async invoke(messages: any[]) {
    return {
      messages: [
        { role: 'user', content: messages[0].content },
        { role: 'assistant', content: 'Mocked response' }
      ],
      iterations: 1,
      recursion_limit_reached: false
    };
  }

  async *stream(messages: any[]) {
    yield {
      event: 'message',
      message: { role: 'assistant', content: 'Mocked stream' }
    };
  }

  registerTool() {}
}
```

### Test with React Testing Library

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AgentFlowProvider } from '../contexts/AgentFlowContext';
import Chat from '../components/Chat';

jest.mock('@10xscale/agentflow-client');

test('sends message and displays response', async () => {
  render(
    <AgentFlowProvider baseUrl="http://test">
      <Chat />
    </AgentFlowProvider>
  );

  const input = screen.getByRole('textbox');
  const button = screen.getByRole('button', { name: /send/i });

  fireEvent.change(input, { target: { value: 'Hello' } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText('Mocked response')).toBeInTheDocument();
  });
});
```

## 📊 State Management

### With Redux

```typescript
// store/agentflowSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { agentFlowClient } from '../utils/agentflow';

export const sendMessage = createAsyncThunk(
  'agentflow/sendMessage',
  async (messages: Message[]) => {
    const response = await agentFlowClient.invoke(messages);
    return response;
  }
);

const agentflowSlice = createSlice({
  name: 'agentflow',
  initialState: { messages: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});
```

### With Zustand

```typescript
// store/agentflowStore.ts
import create from 'zustand';
import { Message } from '@10xscale/agentflow-client';
import { agentFlowClient } from '../utils/agentflow';

interface AgentFlowStore {
  messages: Message[];
  loading: boolean;
  sendMessage: (text: string) => Promise<void>;
}

export const useAgentFlowStore = create<AgentFlowStore>((set, get) => ({
  messages: [],
  loading: false,
  
  sendMessage: async (text: string) => {
    set({ loading: true });
    
    const userMsg = Message.text_message(text, 'user');
    const currentMessages = [...get().messages, userMsg];
    
    try {
      const result = await agentFlowClient.invoke(currentMessages);
      set({ messages: result.messages, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  }
}));
```

## 🎯 Best Practices

### ✅ Do's

1. **Use Context Provider** - Share client across app
2. **Memoize Client** - Avoid recreating on every render
3. **Handle Loading States** - Show feedback during requests
4. **Handle Errors** - Display user-friendly error messages
5. **Type Everything** - Use TypeScript for better DX
6. **Clean Up Effects** - Prevent memory leaks with cleanup
7. **Use Custom Hooks** - Encapsulate common patterns
8. **Test Components** - Mock client for unit tests

### ❌ Don'ts

1. **Don't Create Multiple Clients** - One per app
2. **Don't Ignore Errors** - Always handle failures
3. **Don't Block UI** - Use loading states
4. **Don't Store Client in State** - Use context or memo
5. **Don't Forget Cleanup** - Cancel pending requests
6. **Don't Hard-code URLs** - Use environment variables

## 📚 Next Steps

- **[React Examples](./react-examples.md)** - Complete component examples
- **[API Reference](./api-reference.md)** - Full API documentation
- **[Troubleshooting](./troubleshooting.md)** - Common issues

---

**Need more examples?** Check out the [React Examples](./react-examples.md) guide for complete working components!
