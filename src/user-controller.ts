import { IncomingMessage, ServerResponse } from 'node:http';
import * as uuid from 'uuid';
import { UserRepository } from './data-access/user-repository';
import { HttpResponseMessages } from './const/response-messages';
import { readStreamToString } from './utils/stream-utils';
import { User } from './entities/User';

export class UserController {
    constructor(private userRepository: UserRepository) {};

    getUsers = async (req: IncomingMessage, res: ServerResponse, params: {[param: string]: string}) => {
        const users = this.userRepository.getAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(users));
    }

    getUserById = async (req: IncomingMessage, res: ServerResponse, params: {[param: string]: string}) => {
        const { userId } = params;
        if (!uuid.validate(userId)) {
            res.statusCode = 400;
            res.end('user id is not valid uuid');
            return;
        }
        const user = this.userRepository.get(userId);
        if (!user) {
            res.statusCode = 404;
            res.end(HttpResponseMessages.NotFound);
            return;
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(user));
    }

    addUser = async (req: IncomingMessage, res: ServerResponse, params: {[param: string]: string}) => {
        const str = await readStreamToString(req);
        let user: User;
        try {
            const parsedUser = JSON.parse(str) as User;
            const id = uuid.v4();
            user = new User(id, parsedUser.userName, parsedUser.age, parsedUser.hobbies);
            //todo: Server should answer with status code 400 and corresponding message if request body does not contain required fields
        }
        catch (e) {
            res.statusCode = 400;
            res.end(HttpResponseMessages.BadRequest);
            return;
        }

        this.userRepository.save(user);
        res.statusCode = 201;
        res.end(JSON.stringify(user));
    }

    updateUser = async (req: IncomingMessage, res: ServerResponse, params: {[param: string]: string}) => {
        //todo: Server should answer with status code 200 and updated record
        //todo: Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
        //todo: Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
        res.end(`add user ${params.userId}`);
    }

    deleteUser = async (req: IncomingMessage, res: ServerResponse, params: {[param: string]: string}) => {
        //todo: Server should answer with status code 204 if the record is found and deleted
        //todo: Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
        //todo: Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
        res.end(`delete user ${params.userId}`);
    }
}