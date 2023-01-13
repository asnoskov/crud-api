import * as http from 'node:http';
import { IncomingMessage, ServerResponse } from 'node:http';
import { URL } from 'node:url';
import { UserRepository } from './data-access/user-repository';
import { RouteConfiguration } from './router/interfaces';
import { Router } from './router/router';
import { UserController } from './user-controller';

const userRepository = new UserRepository();
const userController = new UserController(userRepository);
const routesConfiguration: RouteConfiguration[] = [
    {
        method: 'GET',
        path: 'api/users',
        handler: userController.getUsers
    },
    {
        method: 'GET',
        path: 'api/users/{userId}',
        handler: userController.getUserById
    },
    { 
        method: 'POST',
        path: 'api/users',
        handler: userController.addUser
    },
    {
        method: 'PUT', 
        path: 'api/users/{userId}',
        handler: userController.updateUser
    },
    {
        method: 'DELETE', 
        path: 'api/users/{userId}',
        handler: userController.deleteUser
    },
];
const router = new Router(routesConfiguration);

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    try {
        const path = new URL(req.url || '', 'http://localhost').pathname;
        const resolvedRoute = router.resolveRoute(req.method || '', path);
        if (!resolvedRoute) {
            res.statusCode = 404;
            res.end('Not Found');
        } else {
            resolvedRoute.handler(req, res, resolvedRoute.paramValues);
        }
    }
    catch {
        res.statusCode = 500;
        res.end('Internal Server Error');
    }
};

const server = http.createServer(requestListener);
server.listen(3000);
console.log('server started');