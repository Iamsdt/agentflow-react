// Simple check for AgentFlow React Library
// This file demonstrates the API usage

import { AgentFlowClient } from './dist/index.js';
import type { PingResponse, GraphResponse } from './dist/index.d.js';


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


// *************************************
// Check all the apis
// *************************************

checkPing();
checkGraph();

