export class ToolResultBlock {
    constructor(props) {
        this.call_id = props.call_id;
        this.output = props.output;
        this.status = props.status;
        this.is_error = props.is_error;
    }
}
export class Message {
    static toolMessage(content) {
        return { content };
    }
}
export class ToolExecutor {
    constructor(tools = []) {
        this.tools = new Map();
        for (const func of tools) {
            this.tools.set(func.name, func);
        }
    }
    /**
     * Get all tools in OpenAI-compatible format
     */
    all_tools() {
        const openaiTools = [];
        for (const [name, func] of this.tools) {
            const tool = {
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
    hasToolCalls(response) {
        if (!response.messages)
            return false;
        return response.messages.some(msg => msg.content && msg.content.some(block => block.type === 'remote_tool_call'));
    }
    /**
     * Extract and execute all tool calls from the response
     * Returns an array of tool result messages
     */
    async executeToolCalls(response) {
        const toolCalls = [];
        // Extract all remote_tool_call blocks from messages
        for (const msg of response.messages) {
            if (msg.content) {
                for (const block of msg.content) {
                    if (block.type === 'remote_tool_call') {
                        toolCalls.push(block);
                    }
                }
            }
        }
        const results = [];
        // Execute each tool call
        for (const call of toolCalls) {
            const toolName = call.name;
            if (this.tools.has(toolName)) {
                const tool = this.tools.get(toolName);
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
                }
                catch (error) {
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
            }
            else {
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
}
