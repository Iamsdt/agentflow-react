export async function ping(context) {
    try {
        if (context.debug) {
            console.debug('AgentFlowClient: Pinging server at', context.baseUrl);
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), context.timeout);
        const response = await fetch(`${context.baseUrl}/v1/ping`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(context.authToken && { 'Authorization': `Bearer ${context.authToken}` })
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            console.warn(`AgentFlowClient: Ping failed with HTTP ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (context.debug) {
            console.info('AgentFlowClient: Ping successful', data);
        }
        return data;
    }
    catch (error) {
        if (context.debug) {
            console.debug('AgentFlowClient: Ping failed:', error);
        }
        if (error.name === 'AbortError') {
            console.warn(`AgentFlowClient: Ping timeout after ${context.timeout}ms`);
            throw new Error(`Request timeout after ${context.timeout}ms`);
        }
        console.error('AgentFlowClient: Ping failed:', error);
        throw error;
    }
}
