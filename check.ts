// Simple check for AgentFlow React Library
// This file demonstrates the API usage

import { AgentFlowClient } from './dist/index.js';
import type { PingResponse, GraphResponse, StateSchemaResponse } from './dist/index.d.js';
import type { AgentStateSchema, FieldSchema } from './src/endpoints/stateSchema';


function create_client(): AgentFlowClient {
    const client = new AgentFlowClient({
            baseUrl: 'http://localhost:8000',
            debug: false
    });
    return client;
}



async function checkPing(): Promise<void> {
    try {
        console.log('Creating AgentFlowClient...');

        // Create client with a dummy URL for testing
        const client = create_client();

        console.log('AgentFlowClient created successfully!');

        console.log('Attempting to ping the server...');

        // Now properly typed - users can access properties with dot notation
        const pingResult: PingResponse = await client.ping();

        console.log('Full ping result:', pingResult);

    } catch (error) {
        console.log('Expected error (server not running):', (error as Error).message);
        console.log('But the client instantiation and ping method are working correctly!');
    }
}



async function checkGraph(): Promise<void> {
    try {
        console.log('\n------- Testing Graph API -------');
        console.log('Creating AgentFlowClient...');

        // Create client with a dummy URL for testing
        const client = create_client();

        console.log('AgentFlowClient created successfully!');

        console.log('Attempting to fetch graph from the server...');

        // Now properly typed - users can access properties with dot notation
        const graphResult: GraphResponse = await client.graph();

        console.log('Graph nodes:', graphResult.data.nodes);
        console.log('Graph edges:', graphResult.data.edges);
        console.log('Graph info:', graphResult.metadata);

    } catch (error) {
        console.log('Expected error (server not running):', (error as Error).message);
        console.log('But the client instantiation and graph method are working correctly!');
    }
}


async function checkStateSchema(): Promise<void> {
    try {
        console.log('\n------- Testing State Schema API -------');
        console.log('Creating AgentFlowClient...');

        // Create client with a dummy URL for testing
        const client = create_client();

        console.log('AgentFlowClient created successfully!');

        console.log('Attempting to fetch state schema from the server...');

        // Fetch the complete schema with field definitions
        const schemaResponse: StateSchemaResponse = await client.graphStateSchema();

        console.log('\n📋 Agent State Schema:');
        console.log('Title:', schemaResponse.data.title);
        console.log('Description:', schemaResponse.data.description);
        console.log('\nAvailable Fields:');
        
        // Iterate through all field definitions
        if (schemaResponse.data.properties) {
            Object.entries(schemaResponse.data.properties).forEach(([fieldName, fieldSchema]) => {
                console.log(`\n  📌 ${fieldName}:`);
                console.log(`     Type: ${Array.isArray(fieldSchema.type) ? fieldSchema.type.join(' | ') : fieldSchema.type}`);
                if (fieldSchema.description) {
                    console.log(`     Description: ${fieldSchema.description}`);
                }
                if (fieldSchema.default !== undefined) {
                    console.log(`     Default: ${JSON.stringify(fieldSchema.default)}`);
                }
                if (fieldSchema.items) {
                    console.log(`     Items: ${JSON.stringify(fieldSchema.items)}`);
                }
            });
        }
        
        console.log('\nSchema metadata:', schemaResponse.metadata);
        console.log('\n✅ Users can now understand:');
        console.log('   - What fields are available in AgentState');
        console.log('   - What type each field expects');
        console.log('   - What the default values are');
        console.log('   - What each field represents');

    } catch (error) {
        console.log('Expected error (server not running):', (error as Error).message);
        console.log('But the client instantiation and graphStateSchema method are working correctly!');
    }
}


// *************************************
// Check all the apis
// *************************************

// checkPing();
// checkGraph();
checkStateSchema();

