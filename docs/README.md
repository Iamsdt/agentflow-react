# State Schema API - Documentation Index

## 📚 Documentation Guide

Start here to understand the State Schema API and how to use it in your application.

### For Quick Start 🚀
**Start here if you want to get using the API quickly**

👉 **[Quick Reference Guide](./state-schema-quick-ref.md)**
- What is it in 30 seconds
- Basic usage example
- Common use cases
- Real-world examples
- Type definitions

### For Complete Understanding 📖
**Read this for comprehensive knowledge**

👉 **[Complete Usage Guide](./state-schema-guide.md)**
- Overview and motivation
- Response structure explained
- Field schema breakdown
- 3 detailed use cases:
  - Build dynamic forms
  - Validate data
  - Display field information
- Dynamic fields explained
- Type definitions with full descriptions
- Error handling patterns
- Benefits summary

### For Design Rationale 🎯
**Understand why we made this change**

👉 **[Direction Change Document](./DIRECTION_CHANGE.md)**
- What the problem was
- How we solved it
- Before/after comparison
- User benefits explained
- Files changed summary
- Key improvements
- Migration path if needed

### For Implementation Details 🔧
**Deep dive into the technical implementation**

👉 **[Implementation Summary](./state-schema-implementation.md)**
- What changed in each file
- Type definitions added
- Test updates
- Response structure
- Test results (26/26 passing)
- File modification list
- Why this approach is better

### For Practical Code Examples 💡
**See how to actually use the API**

👉 **[Code Examples File](../examples/state-schema-examples.ts)**

Six complete, runnable examples:

1. **Display Schema**
   - Show all available fields
   - Display types and descriptions

2. **Build Form Configuration**
   - Generate form field configs
   - Include types, labels, defaults

3. **Validate Data**
   - Check required fields
   - Validate field types

4. **Identify Core vs Dynamic Fields**
   - Understand field categories
   - List dynamic fields

5. **Generate TypeScript Types**
   - Auto-generate interfaces
   - Use schema to create types

6. **Generate Documentation**
   - Create markdown docs
   - Include field information

## 📋 Quick Navigation

| Need | Document |
|------|----------|
| **Just starting?** | [Quick Reference](./state-schema-quick-ref.md) |
| **Full understanding?** | [Complete Guide](./state-schema-guide.md) |
| **Why this approach?** | [Direction Change](./DIRECTION_CHANGE.md) |
| **Implementation details?** | [Implementation Summary](./state-schema-implementation.md) |
| **Code examples?** | [Examples File](../examples/state-schema-examples.ts) |

## 🎓 Learning Path

### Level 1: Beginner
1. Read: [Quick Reference](./state-schema-quick-ref.md) (5 minutes)
2. Check: Example 1 in [Examples](../examples/state-schema-examples.ts)
3. Try: `await client.graphStateSchema()`

### Level 2: Intermediate
1. Read: [Complete Guide](./state-schema-guide.md) (15 minutes)
2. Try: Examples 2-3 (forms and validation)
3. Implement: Simple form generation

### Level 3: Advanced
1. Read: [Direction Change](./DIRECTION_CHANGE.md) (10 minutes)
2. Read: [Implementation Details](./state-schema-implementation.md) (10 minutes)
3. Try: Examples 5-6 (type generation, docs generation)
4. Extend: Build custom use cases

## 🔍 Find What You Need

### I want to...

**...understand what the API does**
→ [Quick Reference](./state-schema-quick-ref.md) - "What is it?" section

**...build a form**
→ [Complete Guide](./state-schema-guide.md) - "Use Cases" > "Build a Dynamic Form"
→ [Examples](../examples/state-schema-examples.ts) - Example 2

**...validate data**
→ [Complete Guide](./state-schema-guide.md) - "Use Cases" > "Validate Data Before Sending"
→ [Examples](../examples/state-schema-examples.ts) - Example 3

**...generate TypeScript types**
→ [Examples](../examples/state-schema-examples.ts) - Example 5

**...understand the design decisions**
→ [Direction Change](./DIRECTION_CHANGE.md)

**...see the implementation**
→ [Implementation Summary](./state-schema-implementation.md)

**...check error handling**
→ [Complete Guide](./state-schema-guide.md) - "Error Handling"
→ [Quick Reference](./state-schema-quick-ref.md) - "Error Handling"

**...understand core vs dynamic fields**
→ [Complete Guide](./state-schema-guide.md) - "Dynamic Fields"
→ [Examples](../examples/state-schema-examples.ts) - Example 4

## 📊 What You'll Learn

After reading these docs, you'll understand:

✅ What the State Schema API returns
✅ How to iterate through field definitions
✅ How to build forms automatically
✅ How to validate data using the schema
✅ How to generate TypeScript types
✅ How to handle errors
✅ The design decisions behind the API
✅ How to use dynamic/custom fields

## 🚀 Quick Start Code

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
  console.log(`${name}: ${field.type}`);
  if (field.description) console.log(`  ${field.description}`);
  if (field.default !== undefined) console.log(`  Default: ${field.default}`);
});
```

## 📞 Support

Having issues? Check:
1. [Error Handling](./state-schema-quick-ref.md#error-handling) section
2. [Quick Reference](./state-schema-quick-ref.md)
3. [Examples](../examples/state-schema-examples.ts)
4. [Implementation Details](./state-schema-implementation.md)

## 📈 Documentation Stats

- 📄 4 markdown guides (50+ KB of documentation)
- 💻 1 example file with 6 complete examples (500+ lines of code)
- ✅ 26/26 tests passing
- 🎯 Self-documenting API with full type definitions

## 🎯 Key Takeaways

1. **Schema First**: API returns schema definitions, not data
2. **Self-Documenting**: Fields include descriptions, types, defaults
3. **Extensible**: Supports dynamic fields from server configuration
4. **Type-Safe**: Full TypeScript support with generated types
5. **Developer-Friendly**: Build forms, validation, docs automatically

---

**Last Updated**: October 19, 2025
**Status**: ✅ Production Ready
**Tests**: 26/26 Passing
**TypeScript**: ✅ All types defined
