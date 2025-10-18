import { ping } from './endpoints/ping.js';
export class AgentFlowClient {
    constructor(config) {
        this.baseUrl = config.baseUrl;
        this.authToken = config.authToken;
        this.timeout = config.timeout || 300000; // 5 min
        this.debug = config.debug || false;
    }
    async ping() {
        const context = {
            baseUrl: this.baseUrl,
            authToken: this.authToken,
            timeout: this.timeout,
            debug: this.debug
        };
        return ping(context);
    }
}
