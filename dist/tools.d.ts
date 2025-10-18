export interface ToolHandler {
    (args: any): Promise<any>;
}
export interface ToolParameter {
    type: string;
    properties: Record<string, any>;
    required: string[];
}
export interface Tool {
    type: string;
    function: {
        name: string;
        description: string;
        parameters: ToolParameter;
    };
}
export interface InvokeResponse {
    messages: Message[];
}
export interface Message {
    content?: any[];
}
export interface RemoteToolCallBlock {
    type: 'remote_tool_call';
    name: string;
    id: string;
    args: any;
}
export declare class ToolResultBlock {
    call_id: string;
    output: any;
    status: string;
    is_error: boolean;
    constructor(props: {
        call_id: string;
        output: any;
        status: string;
        is_error: boolean;
    });
}
export declare class Message {
    static toolMessage(content: ToolResultBlock[]): Message;
}
export interface ToolDefinition extends ToolHandler {
    name: string;
    description?: string;
    parameters?: ToolParameter;
}
export declare class ToolExecutor {
    private tools;
    constructor(tools?: ToolDefinition[]);
    /**
     * Get all tools in OpenAI-compatible format
     */
    all_tools(): Tool[];
    /**
     * Check if the response contains any remote tool calls
     */
    hasToolCalls(response: InvokeResponse): boolean;
    /**
     * Extract and execute all tool calls from the response
     * Returns an array of tool result messages
     */
    executeToolCalls(response: InvokeResponse): Promise<Message[]>;
}
