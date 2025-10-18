import { ToolDefinition } from '../tools';
import { ping, PingContext, PingResponse } from './endpoints/ping.js';

export interface AgentFlowConfig {
    baseUrl: string;
    authToken?: string | null;
    tools?: ToolDefinition[];
    timeout?: number; // default 5min
    debug?: boolean;
}

export class AgentFlowClient {
    private baseUrl: string;
    private authToken?: string | null;
    private timeout: number;
    private debug: boolean;

    constructor(config: AgentFlowConfig) {
        this.baseUrl = config.baseUrl;
        this.authToken = config.authToken;
        this.timeout = config.timeout || 300000; // 5 min
        this.debug = config.debug || false;
    }

    async ping(): Promise<PingResponse> {
        const context: PingContext = {
            baseUrl: this.baseUrl,
            authToken: this.authToken,
            timeout: this.timeout,
            debug: this.debug
        };

        return ping(context);
    }
}