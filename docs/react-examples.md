# React Component Examples

Complete, copy-paste ready React components demonstrating real-world usage of **AgentFlow React**.

## 📚 Table of Contents

1. [Simple Chat Component](#1-simple-chat-component) - Basic invoke pattern
2. [Streaming Chat Component](#2-streaming-chat-component) - Real-time streaming
3. [Dynamic Form Builder](#3-dynamic-form-builder) - State schema forms
4. [Agent with Tools](#4-agent-with-tools) - Tool registration and execution
5. [Multi-step Workflow UI](#5-multi-step-workflow-ui) - Complex workflows
6. [Thread Management UI](#6-thread-management-ui) - Thread state management

---

## 1. Simple Chat Component

Basic chat interface using the `invoke()` method.

### Features
- ✅ Message history
- ✅ Loading states
- ✅ Error handling
- ✅ Auto-scroll to bottom

### Code

```typescript
// components/SimpleChat.tsx
import { useState, useRef, useEffect } from 'react';
import { AgentFlowClient, Message } from '@10xscale/agentflow-client';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function SimpleChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize client (in real app, use Context)
  const client = useRef(new AgentFlowClient({
    baseUrl: process.env.REACT_APP_AGENTFLOW_URL || 'http://localhost:8000'
  })).current;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Convert to Message format for API
      const apiMessages = [...messages, userMessage].map(msg =>
        Message.text_message(msg.content, msg.role)
      );

      // Send to agent
      const result = await client.invoke(apiMessages);

      // Extract assistant messages from result
      const assistantMessages = result.messages
        .filter(msg => msg.role === 'assistant')
        .map(msg => ({
          role: 'assistant' as const,
          content: typeof msg.content === 'string' 
            ? msg.content 
            : JSON.stringify(msg.content),
          timestamp: new Date()
        }));

      setMessages(prev => [...prev, ...assistantMessages]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2>AgentFlow Chat</h2>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            👋 Send a message to start the conversation
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
            }}
          >
            <div style={styles.messageRole}>
              {msg.role === 'user' ? '👤 You' : '🤖 Assistant'}
            </div>
            <div style={styles.messageContent}>{msg.content}</div>
            <div style={styles.messageTime}>
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, ...styles.assistantMessage }}>
            <div style={styles.messageRole}>🤖 Assistant</div>
            <div style={styles.typing}>
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {/* Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={loading}
          style={styles.input}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={styles.button}
        >
          {loading ? '⏳' : '📤'} Send
        </button>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '600px',
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  header: {
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd'
  },
  messages: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto' as const,
    backgroundColor: '#fff'
  },
  emptyState: {
    textAlign: 'center' as const,
    color: '#999',
    padding: '40px',
    fontSize: '16px'
  },
  message: {
    marginBottom: '16px',
    padding: '12px',
    borderRadius: '8px',
    maxWidth: '70%'
  },
  userMessage: {
    marginLeft: 'auto',
    backgroundColor: '#007bff',
    color: 'white'
  },
  assistantMessage: {
    marginRight: 'auto',
    backgroundColor: '#f0f0f0',
    color: '#333'
  },
  messageRole: {
    fontSize: '12px',
    fontWeight: 'bold' as const,
    marginBottom: '4px',
    opacity: 0.8
  },
  messageContent: {
    fontSize: '14px',
    lineHeight: '1.5'
  },
  messageTime: {
    fontSize: '11px',
    marginTop: '4px',
    opacity: 0.6
  },
  typing: {
    display: 'flex',
    gap: '4px'
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c00',
    borderTop: '1px solid #fcc'
  },
  inputContainer: {
    display: 'flex',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #ddd',
    gap: '8px'
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default SimpleChat;
```

### What You'll Learn
- Basic message handling with `invoke()`
- Managing conversation history
- Loading and error states
- UI updates on message submission

---

## 2. Streaming Chat Component

Real-time streaming chat with visual feedback.

### Features
- ✅ Real-time message streaming
- ✅ Typing indicators
- ✅ Streaming animation
- ✅ Token-by-token display

### Code

```typescript
// components/StreamingChat.tsx
import { useState, useRef, useEffect } from 'react';
import { AgentFlowClient, Message, StreamChunk } from '@10xscale/agentflow-client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  timestamp: Date;
}

export function StreamingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageRef = useRef<string>('');
  
  const client = useRef(new AgentFlowClient({
    baseUrl: process.env.REACT_APP_AGENTFLOW_URL || 'http://localhost:8000'
  })).current;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || streaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setStreaming(true);
    setError(null);
    streamingMessageRef.current = '';

    try {
      // Prepare messages for API
      const apiMessages = [...messages, userMessage].map(msg =>
        Message.text_message(msg.content, msg.role)
      );

      // Start streaming
      const stream = client.stream(apiMessages, {
        response_granularity: 'low'
      });

      // Add placeholder for streaming message
      const streamingMsgId = `streaming-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: streamingMsgId,
        role: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: new Date()
      }]);

      // Process stream chunks
      for await (const chunk of stream) {
        if (chunk.event === 'message' && chunk.message?.role === 'assistant') {
          const content = typeof chunk.message.content === 'string'
            ? chunk.message.content
            : JSON.stringify(chunk.message.content);

          streamingMessageRef.current = content;

          // Update streaming message
          setMessages(prev => prev.map(msg =>
            msg.id === streamingMsgId
              ? { ...msg, content, isStreaming: true }
              : msg
          ));
        }
      }

      // Mark as complete
      setMessages(prev => prev.map(msg =>
        msg.id === streamingMsgId
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Streaming failed');
      console.error('Streaming error:', err);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2>🌊 Streaming Chat</h2>
        {streaming && <span style={styles.streamingBadge}>⚡ Streaming...</span>}
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
            }}
          >
            <div style={styles.messageRole}>
              {msg.role === 'user' ? '👤 You' : '🤖 Assistant'}
            </div>
            <div style={styles.messageContent}>
              {msg.content || (msg.isStreaming && '▋')}
            </div>
            {msg.isStreaming && (
              <div style={styles.streamingIndicator}>
                <span className="pulse">●</span> Generating...
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && <div style={styles.error}>⚠️ {error}</div>}

      {/* Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={streaming}
          style={styles.input}
        />
        <button
          onClick={sendMessage}
          disabled={streaming || !input.trim()}
          style={styles.button}
        >
          {streaming ? '⏳' : '🚀'} Send
        </button>
      </div>

      {/* Add CSS animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Styles (reuse from SimpleChat with additions)
const styles = {
  // ... (same as SimpleChat)
  streamingBadge: {
    marginLeft: '12px',
    padding: '4px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold' as const
  },
  streamingIndicator: {
    fontSize: '11px',
    marginTop: '8px',
    color: '#4CAF50',
    fontStyle: 'italic' as const
  },
  // ... rest of styles
  container: { /* same as SimpleChat */ },
  header: { /* same as SimpleChat */ },
  messages: { /* same as SimpleChat */ },
  message: { /* same as SimpleChat */ },
  userMessage: { /* same as SimpleChat */ },
  assistantMessage: { /* same as SimpleChat */ },
  messageRole: { /* same as SimpleChat */ },
  messageContent: { /* same as SimpleChat */ },
  error: { /* same as SimpleChat */ },
  inputContainer: { /* same as SimpleChat */ },
  input: { /* same as SimpleChat */ },
  button: { /* same as SimpleChat */ }
};
```

### What You'll Learn
- Real-time streaming with `stream()`
- Handling stream chunks
- Visual streaming indicators
- Updating UI during streaming

---

## 3. Dynamic Form Builder

Generate forms dynamically from state schema.

### Features
- ✅ Auto-generate form fields
- ✅ Type-aware inputs
- ✅ Validation
- ✅ Default values

### Code

```typescript
// components/DynamicFormBuilder.tsx
import { useState, useEffect } from 'react';
import { AgentFlowClient, AgentStateSchema, FieldSchema } from '@10xscale/agentflow-client';

export function DynamicFormBuilder() {
  const [schema, setSchema] = useState<AgentStateSchema | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const client = new AgentFlowClient({
    baseUrl: process.env.REACT_APP_AGENTFLOW_URL || 'http://localhost:8000'
  });

  // Fetch schema on mount
  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      const response = await client.graphStateSchema();
      setSchema(response.data);
      
      // Initialize form with default values
      const defaults: Record<string, any> = {};
      Object.entries(response.data.properties).forEach(([name, field]) => {
        if (field.default !== undefined) {
          defaults[name] = field.default;
        }
      });
      setFormData(defaults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schema');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Validate required fields
      if (schema?.required) {
        for (const field of schema.required) {
          if (!formData[field]) {
            throw new Error(`${field} is required`);
          }
        }
      }

      // Submit to API (example: updateThreadState)
      await client.updateThreadState({
        thread_id: 'example-thread',
        state: formData
      });

      alert('Form submitted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (name: string, field: FieldSchema) => {
    const fieldType = Array.isArray(field.type) ? field.type[0] : field.type;
    const value = formData[name] ?? field.default ?? '';
    const isRequired = schema?.required?.includes(name);

    switch (fieldType) {
      case 'string':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            required={isRequired}
            style={styles.input}
          />
        );

      case 'number':
      case 'integer':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(name, parseFloat(e.target.value))}
            required={isRequired}
            style={styles.input}
          />
        );

      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleChange(name, e.target.checked)}
            style={styles.checkbox}
          />
        );

      case 'array':
        return (
          <textarea
            value={Array.isArray(value) ? JSON.stringify(value, null, 2) : '[]'}
            onChange={(e) => {
              try {
                handleChange(name, JSON.parse(e.target.value));
              } catch {}
            }}
            rows={4}
            style={styles.textarea}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            style={styles.input}
          />
        );
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading schema...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  if (!schema) {
    return <div>No schema available</div>;
  }

  return (
    <div style={styles.container}>
      <h2>📋 Dynamic Form Builder</h2>
      <p style={styles.description}>
        This form is generated automatically from the AgentState schema
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        {Object.entries(schema.properties).map(([name, field]) => (
          <div key={name} style={styles.formGroup}>
            <label style={styles.label}>
              {field.description || name}
              {schema.required?.includes(name) && (
                <span style={styles.required}> *</span>
              )}
            </label>
            
            {field.description && (
              <div style={styles.hint}>Type: {field.type}</div>
            )}
            
            {renderField(name, field)}
            
            {field.default !== undefined && (
              <div style={styles.defaultValue}>
                Default: {JSON.stringify(field.default)}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          style={styles.submitButton}
        >
          {submitting ? 'Submitting...' : 'Submit Form'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px'
  },
  description: {
    color: '#666',
    marginBottom: '24px'
  },
  loading: {
    textAlign: 'center' as const,
    padding: '40px',
    fontSize: '16px'
  },
  error: {
    padding: '16px',
    backgroundColor: '#fee',
    color: '#c00',
    borderRadius: '4px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  label: {
    fontWeight: 'bold' as const,
    fontSize: '14px'
  },
  required: {
    color: '#c00'
  },
  hint: {
    fontSize: '12px',
    color: '#999'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'monospace'
  },
  checkbox: {
    width: '20px',
    height: '20px'
  },
  defaultValue: {
    fontSize: '12px',
    color: '#999',
    fontStyle: 'italic' as const
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    cursor: 'pointer'
  }
};
```

### What You'll Learn
- Fetching state schema
- Dynamic form generation
- Type-aware input rendering
- Form validation

---

## 4. Agent with Tools

Chat interface with tool execution.

**⚠️ Important Note:** The tools shown in this example are for demonstration purposes. In production:
- **Use backend tools** (defined in your Python agent graph) for most operations
- **Use remote tools** (shown here) ONLY for browser-level APIs like `localStorage`, `navigator.geolocation`, etc.
- See [Tools Guide - When to Use Remote Tools](./tools-guide.md#remote-tools-vs-backend-tools) for detailed guidance

### Features
- ✅ Tool registration
- ✅ Tool execution feedback
- ✅ Multiple tools
- ✅ Tool result display

### Code

```typescript
// components/AgentWithTools.tsx
import { useState, useRef, useEffect } from 'react';
import { AgentFlowClient, Message } from '@10xscale/agentflow-client';

export function AgentWithTools() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toolsExecuted, setToolsExecuted] = useState<string[]>([]);
  
  const client = useRef<AgentFlowClient | null>(null);

  useEffect(() => {
    // Initialize client and register tools
    client.current = new AgentFlowClient({
      baseUrl: process.env.REACT_APP_AGENTFLOW_URL || 'http://localhost:8000',
      debug: true
    });

    // Register calculator tool
    client.current.registerTool({
      node: 'assistant',
      name: 'calculator',
      description: 'Perform mathematical calculations',
      parameters: {
        type: 'object',
        properties: {
          operation: { type: 'string', enum: ['add', 'subtract', 'multiply', 'divide'] },
          a: { type: 'number' },
          b: { type: 'number' }
        },
        required: ['operation', 'a', 'b']
      },
      handler: async ({ operation, a, b }) => {
        console.log(`🔧 Executing calculator: ${operation}(${a}, ${b})`);
        setToolsExecuted(prev => [...prev, `calculator: ${operation}(${a}, ${b})`]);
        
        switch (operation) {
          case 'add': return { result: a + b };
          case 'subtract': return { result: a - b };
          case 'multiply': return { result: a * b };
          case 'divide': return { result: a / b };
          default: throw new Error('Invalid operation');
        }
      }
    });

    // Register weather tool
    client.current.registerTool({
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
        console.log(`🔧 Executing get_weather: ${location}`);
        setToolsExecuted(prev => [...prev, `get_weather: ${location}`]);
        
        // Simulate weather API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          location,
          temperature: Math.floor(Math.random() * 30) + 60,
          conditions: ['sunny', 'cloudy', 'rainy', 'windy'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 40) + 40
        };
      }
    });
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading || !client.current) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setToolsExecuted([]);

    try {
      const apiMessages = [...messages, userMsg].map(msg =>
        Message.text_message(msg.content, msg.role)
      );

      const result = await client.current.invoke(apiMessages, {
        recursion_limit: 10
      });

      setMessages(result.messages.map(msg => ({
        role: msg.role,
        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
      })));
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🔧 Agent with Tools</h2>
        <div style={styles.toolBadges}>
          <span style={styles.badge}>📊 Calculator</span>
          <span style={styles.badge}>🌤️ Weather</span>
        </div>
      </div>

      {/* Tool Execution Log */}
      {toolsExecuted.length > 0 && (
        <div style={styles.toolLog}>
          <strong>🔧 Tools Executed:</strong>
          {toolsExecuted.map((tool, idx) => (
            <div key={idx} style={styles.toolItem}>{tool}</div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={styles.messages}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            Try: "What's 5 + 3?" or "What's the weather in NYC?"
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
            }}
          >
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}

        {loading && <div style={styles.loading}>⏳ Processing (may execute tools)...</div>}
      </div>

      {/* Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about math or weather..."
          disabled={loading}
          style={styles.input}
        />
        <button onClick={sendMessage} disabled={loading} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
  header: { marginBottom: '16px' },
  toolBadges: { display: 'flex', gap: '8px', marginTop: '8px' },
  badge: {
    padding: '4px 12px',
    backgroundColor: '#e0f7fa',
    borderRadius: '12px',
    fontSize: '12px'
  },
  toolLog: {
    padding: '12px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '13px'
  },
  toolItem: {
    marginLeft: '16px',
    marginTop: '4px',
    fontFamily: 'monospace',
    fontSize: '12px'
  },
  messages: {
    minHeight: '400px',
    maxHeight: '400px',
    overflowY: 'auto' as const,
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '16px'
  },
  emptyState: { textAlign: 'center' as const, color: '#999', padding: '40px' },
  message: {
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '4px'
  },
  userMessage: { backgroundColor: '#e3f2fd' },
  assistantMessage: { backgroundColor: '#f5f5f5' },
  loading: { textAlign: 'center' as const, color: '#666', padding: '16px' },
  inputContainer: { display: 'flex', gap: '8px' },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
```

### What You'll Learn
- Tool registration
- Multiple tool types
- Tool execution tracking
- Debug logging

---

## 5. Multi-step Workflow UI

Complex workflow with multiple agent interactions.

```typescript
// components/MultiStepWorkflow.tsx
import { useState } from 'react';
import { AgentFlowClient, Message } from '@10xscale/agentflow-client';

type Step = 'input' | 'processing' | 'review' | 'complete';

export function MultiStepWorkflow() {
  const [step, setStep] = useState<Step>('input');
  const [userInput, setUserInput] = useState('');
  const [processedData, setProcessedData] = useState<any>(null);
  const [finalResult, setFinalResult] = useState<string>('');
  
  const client = new AgentFlowClient({
    baseUrl: process.env.REACT_APP_AGENTFLOW_URL || 'http://localhost:8000'
  });

  const handleSubmit = async () => {
    setStep('processing');
    
    try {
      // Step 1: Process input
      const result1 = await client.invoke([
        Message.text_message(`Process this: ${userInput}`, 'user')
      ]);
      
      setProcessedData(result1.messages);
      setStep('review');
    } catch (err) {
      console.error(err);
      setStep('input');
    }
  };

  const handleConfirm = async () => {
    setStep('processing');
    
    try {
      // Step 2: Finalize
      const result2 = await client.invoke([
        Message.text_message('Finalize the result', 'user')
      ]);
      
      setFinalResult(result2.messages[result2.messages.length - 1]?.content || 'Done!');
      setStep('complete');
    } catch (err) {
      console.error(err);
      setStep('review');
    }
  };

  return (
    <div style={styles.container}>
      <h2>📋 Multi-Step Workflow</h2>
      
      {/* Progress Bar */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressStep, ...(step === 'input' && styles.activeStep) }}>
          1. Input
        </div>
        <div style={{ ...styles.progressStep, ...(step === 'processing' && styles.activeStep) }}>
          2. Processing
        </div>
        <div style={{ ...styles.progressStep, ...(step === 'review' && styles.activeStep) }}>
          3. Review
        </div>
        <div style={{ ...styles.progressStep, ...(step === 'complete' && styles.activeStep) }}>
          4. Complete
        </div>
      </div>

      {/* Step Content */}
      {step === 'input' && (
        <div style={styles.stepContent}>
          <h3>Step 1: Enter Your Input</h3>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your data..."
            rows={6}
            style={styles.textarea}
          />
          <button onClick={handleSubmit} style={styles.button}>
            Submit
          </button>
        </div>
      )}

      {step === 'processing' && (
        <div style={styles.stepContent}>
          <h3>⏳ Processing...</h3>
          <div style={styles.spinner}>Loading...</div>
        </div>
      )}

      {step === 'review' && (
        <div style={styles.stepContent}>
          <h3>Step 3: Review Results</h3>
          <pre style={styles.preview}>
            {JSON.stringify(processedData, null, 2)}
          </pre>
          <div style={styles.buttonGroup}>
            <button onClick={() => setStep('input')} style={styles.secondaryButton}>
              Back
            </button>
            <button onClick={handleConfirm} style={styles.button}>
              Confirm
            </button>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div style={styles.stepContent}>
          <h3>✅ Complete!</h3>
          <div style={styles.result}>{finalResult}</div>
          <button onClick={() => {
            setStep('input');
            setUserInput('');
            setProcessedData(null);
            setFinalResult('');
          }} style={styles.button}>
            Start New Workflow
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
  progressBar: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    justifyContent: 'center'
  },
  progressStep: {
    padding: '12px 24px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '14px'
  },
  activeStep: {
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold' as const
  },
  stepContent: {
    padding: '24px',
    border: '1px solid #ddd',
    borderRadius: '8px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '16px'
  },
  preview: {
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    overflow: 'auto',
    maxHeight: '300px',
    marginBottom: '16px'
  },
  spinner: {
    textAlign: 'center' as const,
    padding: '40px'
  },
  result: {
    padding: '16px',
    backgroundColor: '#d4edda',
    borderRadius: '4px',
    marginBottom: '16px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
```

### What You'll Learn
- Multi-step workflows
- State management across steps
- Progress indicators
- Conditional rendering

---

## 6. Thread Management UI

Manage conversation threads.

```typescript
// components/ThreadManagement.tsx
import { useState, useEffect } from 'react';
import { AgentFlowClient, Message } from '@10xscale/agentflow-client';

interface Thread {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
}

export function ThreadManagement() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  
  const client = new AgentFlowClient({
    baseUrl: process.env.REACT_APP_AGENTFLOW_URL || 'http://localhost:8000'
  });

  const createThread = () => {
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      name: `Thread ${threads.length + 1}`,
      lastMessage: '',
      timestamp: new Date()
    };
    setThreads(prev => [...prev, newThread]);
    setActiveThread(newThread.id);
    setMessages([]);
  };

  const loadThread = async (threadId: string) => {
    setActiveThread(threadId);
    
    try {
      const state = await client.threadState({ thread_id: threadId });
      // Load messages from state
      setMessages(state.data.context || []);
    } catch (err) {
      console.error('Failed to load thread:', err);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeThread) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    try {
      const result = await client.invoke(
        newMessages.map(msg => Message.text_message(msg.content, msg.role))
      );

      setMessages(result.messages);

      // Update thread
      setThreads(prev => prev.map(thread =>
        thread.id === activeThread
          ? {
              ...thread,
              lastMessage: input,
              timestamp: new Date()
            }
          : thread
      ));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const deleteThread = (threadId: string) => {
    setThreads(prev => prev.filter(t => t.id !== threadId));
    if (activeThread === threadId) {
      setActiveThread(null);
      setMessages([]);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h3>💬 Threads</h3>
          <button onClick={createThread} style={styles.newButton}>
            + New
          </button>
        </div>
        <div style={styles.threadList}>
          {threads.map(thread => (
            <div
              key={thread.id}
              onClick={() => loadThread(thread.id)}
              style={{
                ...styles.threadItem,
                ...(activeThread === thread.id && styles.activeThreadItem)
              }}
            >
              <div style={styles.threadName}>{thread.name}</div>
              <div style={styles.threadPreview}>{thread.lastMessage || 'No messages'}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.id);
                }}
                style={styles.deleteButton}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>
        {activeThread ? (
          <>
            <div style={styles.messages}>
              {messages.map((msg, idx) => (
                <div key={idx} style={styles.message}>
                  <strong>{msg.role}:</strong> {msg.content}
                </div>
              ))}
            </div>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                style={styles.input}
              />
              <button onClick={sendMessage} style={styles.sendButton}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={styles.emptyState}>
            👈 Select a thread or create a new one
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '600px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  sidebar: {
    width: '250px',
    borderRight: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column' as const
  },
  sidebarHeader: {
    padding: '16px',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  newButton: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  threadList: {
    flex: 1,
    overflowY: 'auto' as const
  },
  threadItem: {
    padding: '12px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    position: 'relative' as const
  },
  activeThreadItem: {
    backgroundColor: '#e3f2fd'
  },
  threadName: {
    fontWeight: 'bold' as const,
    marginBottom: '4px'
  },
  threadPreview: {
    fontSize: '12px',
    color: '#666',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  },
  deleteButton: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px'
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const
  },
  messages: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto' as const
  },
  message: {
    marginBottom: '12px',
    padding: '8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px'
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontSize: '16px'
  },
  inputContainer: {
    padding: '16px',
    borderTop: '1px solid #ddd',
    display: 'flex',
    gap: '8px'
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  sendButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
```

### What You'll Learn
- Thread management
- Sidebar navigation
- State persistence
- Multi-conversation handling

---

## 🎯 Usage

Copy any component into your React project and customize as needed. All components are self-contained and production-ready.

## 📚 Next Steps

- **[React Integration Guide](./react-integration.md)** - Hooks and patterns
- **[API Reference](./api-reference.md)** - Complete API docs
- **[Getting Started](./getting-started.md)** - Setup guide

---

**Happy coding!** 🚀
