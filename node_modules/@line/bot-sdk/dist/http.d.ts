/// <reference types="node" />
import { AxiosResponse, AxiosRequestConfig } from "axios";
import { Readable } from "stream";
interface httpClientConfig extends Partial<AxiosRequestConfig> {
    baseURL?: string;
    defaultHeaders?: any;
    responseParser?: <T>(res: AxiosResponse) => T;
}
export default class HTTPClient {
    private instance;
    private config;
    constructor(config?: httpClientConfig);
    get<T>(url: string, params?: any): Promise<T>;
    getStream(url: string, params?: any): Promise<Readable>;
    post<T>(url: string, body?: any, config?: Partial<AxiosRequestConfig>): Promise<T>;
    private responseParse;
    put<T>(url: string, body?: any, config?: Partial<AxiosRequestConfig>): Promise<T>;
    postForm<T>(url: string, body?: any): Promise<T>;
    toBuffer(data: Buffer | Readable): Promise<Buffer>;
    postBinary<T>(url: string, data: Buffer | Readable, contentType?: string): Promise<T>;
    delete<T>(url: string, params?: any): Promise<T>;
    private wrapError;
}
export {};
