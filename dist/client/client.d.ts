import { ToolDefinition } from '../tools';
import { PingResponse } from './endpoints/ping.js';
export interface AgentFlowConfig {
    baseUrl: string;
    authToken?: string | null;
    tools?: ToolDefinition[];
    timeout?: number;
    debug?: boolean;
}
export declare class AgentFlowClient {
    private baseUrl;
    private authToken?;
    private timeout;
    private debug;
    constructor(config: AgentFlowConfig);
    ping(): Promise<PingResponse>;
}
