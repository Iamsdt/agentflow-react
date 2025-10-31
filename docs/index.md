# AgentFlow Client - Documentation

Welcome to the **AgentFlow Client** documentation! This guide will help you integrate the AgentFlow multi-agent API into your applications.

## 🚀 Quick Links

| Document | Description |
|----------|-------------|
| **[Getting Started](./getting-started.md)** | Complete setup guide (15 min) |
| **[API Reference](./api-reference.md)** | All methods and types |
| **[React Integration](./react-integration.md)** ⭐ | Hooks, patterns, best practices |
| **[React Examples](./react-examples.md)** ⭐ | Complete component examples |
| **[Tools Guide](./tools-guide.md)** | Tool registration and execution |
| **[Troubleshooting](./troubleshooting.md)** | Common issues and solutions |

## 📖 What is AgentFlow React?

**AgentFlow React** is a TypeScript client library that connects your React applications to the AgentFlow multi-agent system. It provides:

- ✅ **Simple API Client** - Clean interface to AgentFlow backend
- ✅ **Streaming Support** - Real-time responses for chat interfaces
- ✅ **Tool Execution** - Automatic local tool handling
- ✅ **State Management** - Dynamic schema-based state handling
- ✅ **React-Ready** - Built specifically for React applications
- ✅ **TypeScript** - Full type safety and IntelliSense support

---

## 🚨 CRITICAL: Remote Tools vs Backend Tools

**Before you start:** Understanding tool types is essential for proper AgentFlow usage.

### 🔴 Remote Tools (Client-Side - LIMITED USE)
- **WHEN TO USE:** Only for browser-level APIs
  - `navigator.geolocation` (GPS/location)
  - `localStorage`/`sessionStorage` (client-side storage)
  - DOM manipulation and access
  - WebRTC, camera/microphone access
  - File uploads from user's device
- **WHEN NOT TO USE:** Database queries, external APIs, calculations, file operations
- **WHY LIMITED:** Runs in browser, less secure, no server access

### ✅ Backend Tools (Server-Side - PREFERRED)
- **WHEN TO USE:** For most operations
  - Database queries and operations
  - External API calls (weather, payments, etc.)
  - Mathematical calculations
  - File system operations
  - Business logic and data processing
- **WHY PREFERRED:** More secure, efficient, scalable, full server access

**💡 Rule of Thumb:** If your tool needs server-side resources or external APIs, define it as a backend tool in your Python AgentFlow library instead of using remote tools.

---

## 🎓 Learning Path

### 👶 Beginner (Start Here)
1. **[Getting Started](./getting-started.md)** - Install and make your first API call
2. **[API Reference](./api-reference.md)** - Learn core methods: `ping()`, `invoke()`, `stream()`
3. **[React Examples](./react-examples.md)** - See simple chat component example

### 🧑‍💻 Intermediate
4. **[Invoke API Guide](./invoke-usage.md)** - Deep dive into request/response pattern
5. **[Stream API Guide](./stream-usage.md)** - Learn real-time streaming
6. **[Tools Guide](./tools-guide.md)** - Register and execute custom tools
7. **[React Integration](./react-integration.md)** - Custom hooks and patterns

### 🚀 Advanced
8. **[State Schema Guide](./state-schema-guide.md)** - Dynamic forms and validation
9. **[TypeScript Types](./typescript-types.md)** - Advanced type usage
10. **[React Examples](./react-examples.md)** - Complex workflows and multi-step UIs

## 📚 Core Documentation

### Essential Guides

#### [Getting Started](./getting-started.md)
Complete setup guide to get you up and running in 15 minutes. Covers:
- Installation
- Basic configuration
- First API call
- Simple examples

#### [API Reference](./api-reference.md)
Comprehensive reference for all client methods:
- `AgentFlowClient` configuration
- `invoke()` - Batch processing with tools
- `stream()` - Real-time streaming
- `graphStateSchema()` - Get state schema
- `threadState()`, `updateThreadState()`, `clearThreadState()`
- Tool registration API
- Message helpers

#### [React Integration](./react-integration.md) ⭐
**Essential for React developers!** Learn how to:
- Set up AgentFlowClient in React
- Use context providers
- Create custom hooks (`useInvoke`, `useStream`, `useStateSchema`)
- Manage loading and error states
- Best practices for React apps

#### [React Examples](./react-examples.md) ⭐
**Complete working examples** including:
- Simple chat component
- Streaming chat with real-time updates
- Dynamic form builder from schema
- Agent with custom tools
- Multi-step workflows
- Thread management UI

### API Deep Dives

#### [Invoke API - Comprehensive Guide](./invoke-usage.md)
Detailed documentation for the `invoke()` method:
- Request/response patterns
- Tool execution loop
- Recursion handling
- Response granularity
- Error handling
- Complete examples

**Quick Reference:** [Invoke Quick Start](./QUICK_START.md)

#### [Stream API - Comprehensive Guide](./stream-usage.md)
Everything about real-time streaming:
- Streaming architecture
- Event types and handling
- React integration patterns
- Memory efficiency
- Error handling
- Performance tips

**Quick Reference:** [Stream Quick Reference](./stream-quick-ref.md)

#### [State Schema API - Guide](./state-schema-guide.md)
Working with dynamic agent state:
- Schema structure
- Building dynamic forms
- Data validation
- Type generation
- Dynamic fields

**Quick Reference:** [State Schema Quick Reference](./state-schema-quick-ref.md)

### Advanced Topics

#### [Tools Guide](./tools-guide.md)
Master tool registration and execution:
- What are tools?
- **🔴 REMOTE TOOLS vs BACKEND TOOLS** ⚠️ **CRITICAL DISTINCTION**
- Tool registration patterns
- Handler implementation
- OpenAI-style parameters
- Error handling
- Testing tools
- Common patterns (weather, calculator, API calls)

**🚨 REMOTE TOOLS (Client-Side):**
- ✅ **USE ONLY FOR:** Browser APIs (`localStorage`, `navigator.geolocation`, DOM manipulation, WebRTC)
- ❌ **DO NOT USE FOR:** Database queries, external API calls, calculations, file operations
- **INSTEAD:** Define these as backend tools in your Python AgentFlow library

**✅ BACKEND TOOLS (Server-Side - PREFERRED):**
- Database operations, API calls, calculations, file system access
- More secure, efficient, and scalable
- Full access to your server infrastructure

#### [TypeScript Types](./typescript-types.md)
Advanced TypeScript usage:
- Type imports
- Core interfaces
- Type guards
- Custom extensions
- Type-safe tool handlers
- Schema-based type inference

#### [Troubleshooting](./troubleshooting.md)
Solutions to common issues:
- Installation problems
- Connection errors
- Timeout issues
- Authentication failures
- Stream disconnections
- TypeScript errors
- React integration issues

## 🔍 Find What You Need

### I want to...

**...get started quickly**
→ [Getting Started Guide](./getting-started.md)

**...build a chat interface**
→ [React Examples - Chat Component](./react-examples.md#simple-chat-component)

**...use streaming responses**
→ [Stream API Guide](./stream-usage.md) or [Stream Quick Reference](./stream-quick-ref.md)

**...register custom tools**
→ [Tools Guide](./tools-guide.md)
🚨 **REMOTE TOOLS:** Only for browser APIs (geolocation, localStorage, DOM)
❌ **BACKEND TOOLS:** Preferred for everything else (APIs, databases, calculations)

**...build dynamic forms**
→ [State Schema Guide](./state-schema-guide.md) or [React Examples - Form Builder](./react-examples.md#dynamic-form-builder)

**...integrate with React**
→ [React Integration Guide](./react-integration.md)

**...understand all available methods**
→ [API Reference](./api-reference.md)

**...solve an issue**
→ [Troubleshooting Guide](./troubleshooting.md)

**...see complete examples**
→ [React Examples](./react-examples.md) or [/examples folder](../examples/)

## � Installation

```bash
npm install agentflow-react
```

## 🚀 30-Second Example

```typescript
import { AgentFlowClient, Message } from 'agentflow-react';

const client = new AgentFlowClient({
  baseUrl: 'http://localhost:8000'
});

const result = await client.invoke([
  Message.text_message('Hello!', 'user')
]);

console.log(result.messages);
```

