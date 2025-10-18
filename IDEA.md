export interface AgentFlowConfig {
    baseUrl: string;
    authToken?: string | null;
    tools?: ToolDefinition[];
    timeout?: number; # default 5min
    debug?: boolean;
}


async ping() {
        try {
            if (this.debug) {
                console.debug('AgentFlowClient: Pinging server at', this.baseUrl);
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(`${this.baseUrl}/v1/ping`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` })
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (this.debug) {
                console.log('AgentFlowClient: Ping successful', data);
            }

            return data;
        } catch (error) {
            if (this.debug) {
                console.error('AgentFlowClient: Ping failed:', error);
            }

            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${this.timeout}ms`);
            }

            console.error('Ping failed:', error);
            throw error;
        }
    }












# TOOL HANDLER
export interface ToolDefinition extends ToolHandler {
    name: string;
    description?: string;
    parameters?: ToolParameter;
}


class ToolExecutor {
    private tools: Map<string, ToolDefinition>;

    constructor(tools: ToolDefinition[] = []) {
        this.tools = new Map<string, ToolDefinition>();
        for (const func of tools) {
            this.tools.set(func.name, func);
        }
    }

    /**
     * Get all tools in OpenAI-compatible format
     */
    all_tools(): Tool[] {
        const openaiTools: Tool[] = [];
        
        for (const [name, func] of this.tools) {
            const tool: Tool = {
                type: "function",
                function: {
                    name: name,
                    description: func.description || `Execute ${name}`,
                    parameters: func.parameters || {
                        type: "object",
                        properties: {},
                        required: []
                    }
                }
            };
            openaiTools.push(tool);
        }
        
        return openaiTools;
    }

    /**
     * Check if the response contains any remote tool calls
     */
    hasToolCalls(response: InvokeResponse): boolean {
        if (!response.messages) return false;
        
        return response.messages.some(msg =>
            msg.content && msg.content.some(block => 
                block.type === 'remote_tool_call'
            )
        );
    }

    /**
     * Extract and execute all tool calls from the response
     * Returns an array of tool result messages
     */
    async executeToolCalls(response: InvokeResponse): Promise<Message[]> {
        const toolCalls: RemoteToolCallBlock[] = [];
        
        // Extract all remote_tool_call blocks from messages
        for (const msg of response.messages) {
            if (msg.content) {
                for (const block of msg.content) {
                    if (block.type === 'remote_tool_call') {
                        toolCalls.push(block as RemoteToolCallBlock);
                    }
                }
            }
        }
        
        const results: Message[] = [];
        
        // Execute each tool call
        for (const call of toolCalls) {
            const toolName = call.name;
            
            if (this.tools.has(toolName)) {
                const tool = this.tools.get(toolName)!;
                
                try {
                    // Execute the tool
                    const result = await tool(call.args);
                    
                    // Create a tool result message
                    const toolResultBlock = new ToolResultBlock({
                        call_id: call.id,
                        output: result,
                        status: 'completed',
                        is_error: false
                    });
                    
                    results.push(Message.toolMessage([toolResultBlock]));
                } catch (error) {
                    // Handle errors
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    
                    const toolResultBlock = new ToolResultBlock({
                        call_id: call.id,
                        output: { error: errorMessage },
                        status: 'failed',
                        is_error: true
                    });
                    
                    results.push(Message.toolMessage([toolResultBlock]));
                }
            } else {
                // Tool not found error
                const toolResultBlock = new ToolResultBlock({
                    call_id: call.id,
                    output: { error: `Tool '${toolName}' not found` },
                    status: 'failed',
                    is_error: true
                });
                
                results.push(Message.toolMessage([toolResultBlock]));
            }
        }
        
        return results;
    }