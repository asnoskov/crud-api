import { IncomingMessage, ServerResponse } from "node:http";

export type RouteHandler = (req: IncomingMessage, res: ServerResponse, params: {[param: string]: string}) => void;

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
