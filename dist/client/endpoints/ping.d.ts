export interface PingContext {
    baseUrl: string;
    authToken?: string | null;
    timeout: number;
    debug: boolean;
}
export interface PingMetadata {
    request_id: string;
    timestamp: string;
    message: string;
}
export interface PingResponse {
    data: string;
    metadata: PingMetadata;
}
export declare function ping(context: PingContext): Promise<PingResponse>;
