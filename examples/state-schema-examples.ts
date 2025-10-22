/**
 * Example: Using the State Schema API
 * 
 * This file demonstrates practical ways to use the State Schema API
 * to understand and work with the AgentState structure.
 */

import { AgentFlowClient } from '../src/client';
import type { AgentStateSchema, FieldSchema } from '../src/endpoints/stateSchema';

const client = new AgentFlowClient({
  baseUrl: 'http://localhost:8000',
  debug: false
});

/**
 * Example 1: Display all available fields and their types
 */
async function example1_displaySchema() {
  console.log('\n━━━ Example 1: Display Schema ━━━');
  
  const response = await client.graphStateSchema();
  const schema = response.data;
  
  console.log(`\n📋 ${schema.title}`);
  console.log(`${schema.description}\n`);
  
  Object.entries(schema.properties).forEach(([fieldName, fieldSchema]) => {
    const fs = fieldSchema as FieldSchema;
    console.log(`  • ${fieldName}`);
    console.log(`    Type: ${fs.type || 'unknown'}`);
    if (fs.description) {
      console.log(`    Desc: ${fs.description}`);
    }
    if (fs.default !== undefined) {
      console.log(`    Default: ${JSON.stringify(fs.default)}`);
    }
  });
}

/**
 * Example 2: Build a form field configuration from schema
 */
interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  defaultValue: any;
}

async function example2_buildFormConfig(): Promise<FormField[]> {
  console.log('\n━━━ Example 2: Build Form Configuration ━━━');
  
  const response = await client.graphStateSchema();
  const schema = response.data;
  
  const formFields: FormField[] = [];
  
  Object.entries(schema.properties).forEach(([fieldName, fieldSchema]) => {
    const fieldSchemaTyped = fieldSchema as FieldSchema;
    const field: FormField = {
      name: fieldName,
      type: Array.isArray(fieldSchemaTyped.type) 
        ? (fieldSchemaTyped.type[0] as string)
        : (fieldSchemaTyped.type || 'text'),
      label: fieldSchemaTyped.description || fieldName,
      required: schema.required?.includes(fieldName) || false,
      defaultValue: fieldSchemaTyped.default
    };
    
    formFields.push(field);
    console.log(`  ✓ Form field created: ${field.name} (${field.type})`);
  });
  
  return formFields;
}

/**
 * Example 3: Validate data against schema
 */
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

async function example3_validateData(
  data: Record<string, any>
): Promise<ValidationResult> {
  console.log('\n━━━ Example 3: Validate Data ━━━');
  
  const response = await client.graphStateSchema();
  const schema = response.data;
  const errors: string[] = [];
  
  // Check required fields
  if (schema.required) {
    for (const fieldName of schema.required) {
      if (!(fieldName in data)) {
        errors.push(`❌ Missing required field: ${fieldName}`);
      }
    }
  }
  
  // Check field types
  Object.entries(data).forEach(([fieldName, value]) => {
    const fieldSchema = schema.properties[fieldName] as FieldSchema | undefined;
    
    if (!fieldSchema) {
      errors.push(`⚠️  Unknown field: ${fieldName}`);
      return;
    }
    
    // Simple type checking
    if (fieldSchema.type === 'array' && !Array.isArray(value)) {
      errors.push(`❌ ${fieldName} must be an array`);
    } else if (fieldSchema.type === 'object' && typeof value !== 'object') {
      errors.push(`❌ ${fieldName} must be an object`);
    } else if (fieldSchema.type === 'string' && typeof value !== 'string') {
      errors.push(`❌ ${fieldName} must be a string`);
    }
  });
  
  const result: ValidationResult = {
    valid: errors.length === 0,
    errors
  };
  
  console.log(`  Validation: ${result.valid ? '✅ VALID' : '❌ INVALID'}`);
  result.errors.forEach(err => console.log(`    ${err}`));
  
  return result;
}

/**
 * Example 4: Identify core vs dynamic fields
 */
async function example4_coreVsDynamicFields() {
  console.log('\n━━━ Example 4: Core vs Dynamic Fields ━━━');
  
  const response = await client.graphStateSchema();
  const schema = response.data;
  
  const coreFields = ['context', 'context_summary', 'execution_meta'];
  const dynamicFields: string[] = [];
  
  Object.keys(schema.properties).forEach(fieldName => {
    if (!coreFields.includes(fieldName)) {
      dynamicFields.push(fieldName);
    }
  });
  
  console.log(`\n  Core Fields (${coreFields.length}):`);
  coreFields.forEach(f => console.log(`    • ${f}`));
  
  console.log(`\n  Dynamic Fields (${dynamicFields.length}):`);
  if (dynamicFields.length === 0) {
    console.log('    (none)');
  } else {
    dynamicFields.forEach(f => {
      const fieldSchema = schema.properties[f];
      console.log(`    • ${f} (${fieldSchema.type})`);
    });
  }
}

/**
 * Example 5: Generate TypeScript types from schema
 */
function example5_generateTypes(schema: AgentStateSchema): string {
  console.log('\n━━━ Example 5: Generate TypeScript Types ━━━');
  
  let typeDefinition = 'interface AgentStateInput {\n';
  
  Object.entries(schema.properties).forEach(([fieldName, fieldSchema]) => {
    const fs = fieldSchema as FieldSchema;
    const required = !schema.required?.includes(fieldName);
    const questionMark = !required ? '?' : '';
    const typeName = getTypeScriptType(fs);
    
    if (fs.description) {
      typeDefinition += `  /** ${fs.description} */\n`;
    }
    typeDefinition += `  ${fieldName}${questionMark}: ${typeName};\n`;
  });
  
  typeDefinition += '}\n';
  
  console.log('\n  Generated Interface:');
  console.log('  ' + typeDefinition.split('\n').join('\n  '));
  
  return typeDefinition;
}

function getTypeScriptType(fieldSchema: FieldSchema): string {
  if (Array.isArray(fieldSchema.type)) {
    return fieldSchema.type.map((t: any) => getSingleType(t)).join(' | ');
  }
  return getSingleType(fieldSchema.type || 'any');
}

function getSingleType(type?: string): string {
  switch (type) {
    case 'string': return 'string';
    case 'integer': return 'number';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'array': return 'any[]';
    case 'object': return 'Record<string, any>';
    case 'null': return 'null';
    default: return 'any';
  }
}

/**
 * Example 6: Build a schema documentation
 */
async function example6_generateDocumentation() {
  console.log('\n━━━ Example 6: Generate Documentation ━━━');
  
  const response = await client.graphStateSchema();
  const schema = response.data;
  
  let markdown = `# ${schema.title}\n\n`;
  markdown += `${schema.description}\n\n`;
  markdown += '## Fields\n\n';
  
  Object.entries(schema.properties).forEach(([fieldName, fieldSchema]) => {
    const fs = fieldSchema as FieldSchema;
    markdown += `### ${fieldName}\n\n`;
    markdown += `- **Type**: \`${fs.type}\`\n`;
    
    if (fs.description) {
      markdown += `- **Description**: ${fs.description}\n`;
    }
    
    if (fs.default !== undefined) {
      markdown += `- **Default**: \`${JSON.stringify(fs.default)}\`\n`;
    }
    
    if (fs.required) {
      markdown += '- **Required**: Yes\n';
    }
    
    markdown += '\n';
  });
  
  console.log('  Generated Markdown:');
  console.log('  ' + markdown.split('\n').slice(0, 20).join('\n  '));
  console.log('  ...(truncated for display)');
}

/**
 * Run all examples
 */
async function runAllExamples() {
  try {
    // Example 1: Display Schema
    await example1_displaySchema();
    
    // Example 2: Build Form Configuration
    await example2_buildFormConfig();
    
    // Example 3: Validate Data
    const testData = {
      context: [],
      cv_text: 'John Doe CV',
      cid: 'candidate-123'
    };
    await example3_validateData(testData);
    
    // Example 4: Core vs Dynamic Fields
    await example4_coreVsDynamicFields();
    
    // Example 5: Generate Types
    const response = await client.graphStateSchema();
    example5_generateTypes(response.data);
    
    // Example 6: Generate Documentation
    await example6_generateDocumentation();
    
    console.log('\n✅ All examples completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Example failed:', (error as Error).message);
    console.log('Note: Make sure the server is running on http://localhost:8000');
  }
}

// Uncomment to run examples
// runAllExamples();

export {
  example1_displaySchema,
  example2_buildFormConfig,
  example3_validateData,
  example4_coreVsDynamicFields,
  example5_generateTypes,
  example6_generateDocumentation,
  runAllExamples
};
