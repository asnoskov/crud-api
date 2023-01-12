
import * as http from 'node:http';
import { IncomingMessage, ServerResponse } from 'node:http';
import { URL } from 'node:url';
import { RouteConfiguration, Router } from './router/router';

const routesConfiguration: RouteConfiguration[] = [
    { 
        method: 'GET',
        path: 'api/users',
        handler: () => { console.log('get users'); } 
    },
    {
        method: 'GET',
        path: 'api/users/{userId}',
        handler: () => { console.log('get user'); }
    },
    { 
        method: 'POST',
        path: 'api/users',
        handler: () => { console.log('add user'); }
    },
    {
        method: 'PUT', 
        path: 'api/users/{userId}', 
        handler: () => { console.log('add user'); } 
    },
    {
        method: 'DELETE', 
        path: 'api/users/{userId}', 
        handler: () => { console.log('delete user'); } 
    },
];

const router = new Router(routesConfiguration);

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    const path = new URL(req.url || '', 'http://localhost').pathname;
    const resolvedRoute = router.resolveRoute(req.method || '', path);
    if (!resolvedRoute) {
        res.end('Route is not resolved');
    } else {
        res.end(`Route is resolved with param values: ${JSON.stringify(resolvedRoute.paramValues)}.`);
    }
};

const server = http.createServer(requestListener);
server.listen(3000);
console.log('server started');