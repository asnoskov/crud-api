
import * as http from 'node:http';
import { IncomingMessage, ServerResponse } from 'node:http';
import { URL } from 'node:url';
import { RouteConfiguration } from './router/interfaces';
import { Router } from './router/router';

const routesConfiguration: RouteConfiguration[] = [
    {
        method: 'GET',
        path: 'api/users',
        handler: (params, req, res) => { res.end('get users'); } 
    },
    {
        method: 'GET',
        path: 'api/users/{userId}',
        handler: (params, req, res) => { res.end(`get user ${params.userId}`); }
    },
    { 
        method: 'POST',
        path: 'api/users',
        handler: (params, req, res) => { res.end('add user'); }
    },
    {
        method: 'PUT', 
        path: 'api/users/{userId}',
        handler: (params, req, res) => { res.end(`add user ${params.userId}`); } 
    },
    {
        method: 'DELETE', 
        path: 'api/users/{userId}',
        handler: (params, req, res) => { res.end(`delete user ${params.userId}`); } 
    },
];

const router = new Router(routesConfiguration);

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    const path = new URL(req.url || '', 'http://localhost').pathname;
    const resolvedRoute = router.resolveRoute(req.method || '', path);
    if (!resolvedRoute) {
        res.end('Route is not resolved');
    } else {
        resolvedRoute.handler(resolvedRoute.paramValues, req, res);
    }
};

const server = http.createServer(requestListener);
server.listen(3000);
console.log('server started');