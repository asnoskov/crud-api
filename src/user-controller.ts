import { IncomingMessage, ServerResponse } from "node:http";
import { UserRepository } from "./data-access/user-repository";
import { HttpResponseMessages } from './const/response-messages';
import { readStreamToString } from "./utils/stream-utils";
import { User } from "./entities/User";

export class UserController {
    constructor(private userRepository: UserRepository) {};

    getUsers = (req: IncomingMessage, res: ServerResponse, params: {[param: string]: string}) => {
        const users = this.userRepository.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(users));
    }

    getUserById = (req: IncomingMessage, res: ServerResponse, params: {[param: string]: string}) => {
        const { userId } = params;
        //todo: Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
        const user = this.userRepository.get(userId);
        if (!user) {
            res.statusCode = 404;
            res.end(HttpResponseMessages.NotFound);
            return;
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(user));
    }

    addUser = (req: IncomingMessage, res: ServerResponse, params: {[param: string]: string}) => {
        readStreamToString(req).then(str => {
            const user: User = JSON.parse(str);
            //todo: Server should answer with status code 201 and newly created record
            //todo: Server should answer with status code 400 and corresponding message if request body does not contain required fields
            res.end('add user with name: ' + user.userName);
        });
    }

    updateUser = (req: IncomingMessage, res: ServerResponse, params: {[param: string]: string}) => {
        //todo: Server should answer with status code 200 and updated record
        //todo: Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
        //todo: Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
        res.end(`add user ${params.userId}`);
    }

    deleteUser = (req: IncomingMessage, res: ServerResponse, params: {[param: string]: string}) => {
        //todo: Server should answer with status code 204 if the record is found and deleted
        //todo: Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
        //todo: Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
        res.end(`delete user ${params.userId}`);
    }
}