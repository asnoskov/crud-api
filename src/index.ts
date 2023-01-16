import * as http from 'node:http';
import { IncomingMessage, ServerResponse } from 'node:http';
import { URL } from 'node:url';
import * as dotenv from 'dotenv';
import { UserRepository } from './data-access/user-repository';
import { RouteConfiguration } from './router/interfaces';
import { Router } from './router/router';
import { UserController } from './user-controller';

dotenv.config();
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

const requestListener = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const path = new URL(req.url || '', 'http://localhost').pathname;
        const resolvedRoute = router.resolveRoute(req.method || '', path);
        console.log(`recieved request: ${req.method} ${path}`);
        if (!resolvedRoute) {
            res.statusCode = 404;
            res.end('Not Found');
        } else {
            await resolvedRoute.handler(req, res, resolvedRoute.paramValues);
        }
    }
    catch (e) {
        res.statusCode = 500;
        res.end('Internal Server Error');
    }
};

const server = http.createServer(requestListener);
server.listen(process.env.API_PORT);
console.log('server started');