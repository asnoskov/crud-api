import { IncomingMessage, ServerResponse } from "node:http";

export type RouteHandler = (params: {[param: string]: string}, req: IncomingMessage, res: ServerResponse) => void;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RouteConfiguration {
    method: HttpMethod;
    path: string;
    handler: RouteHandler;
}

export interface ResolvedRoute {
    handler: RouteHandler,
    paramValues: {[param: string]: string}
}
