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
        const requestBody = await readStreamToString(req);
        let user: User;
        try {
            const parsedUser = JSON.parse(requestBody) as User;
            const id = uuid.v4();
            user = new User(id, parsedUser.userName, parsedUser.age, parsedUser.hobbies);
            if (!user.checkIsValid()) {
                res.statusCode = 400;
                res.end(HttpResponseMessages.BadRequest);
                return;
            }
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
        const { userId } = params;
        const requestBody = await readStreamToString(req);
        if (!uuid.validate(userId)) {
            res.statusCode = 400;
            res.end('user id is not valid uuid');
            return;
        }
        let user: User;
        try {
            const parsedUser = JSON.parse(requestBody) as User;
            user = new User(userId, parsedUser.userName, parsedUser.age, parsedUser.hobbies);
            if (!user.checkIsValid()) {
                res.statusCode = 400;
                res.end(HttpResponseMessages.BadRequest);
                return;
            }
        }
        catch (e) {
            res.statusCode = 400;
            res.end(HttpResponseMessages.BadRequest);
            return;
        }

        const userFromDb = this.userRepository.get(user.id);
        if (!userFromDb) {
            res.statusCode = 404;
            res.end(HttpResponseMessages.NotFound);
            return;
        }

        userFromDb.userName = user.userName;
        userFromDb.age = user.age;
        userFromDb.hobbies = user.hobbies;

        this.userRepository.save(userFromDb);
        res.statusCode = 200;
        res.end(JSON.stringify(user));
    }

    deleteUser = async (req: IncomingMessage, res: ServerResponse, params: {[param: string]: string}) => {
        const { userId } = params;
        if (!uuid.validate(userId)) {
            res.statusCode = 400;
            res.end('user id is not valid uuid');
            return;
        }
        const userFromDb = this.userRepository.get(userId);
        if (!userFromDb) {
            res.statusCode = 404;
            res.end(HttpResponseMessages.NotFound);
            return;
        }
        this.userRepository.delete(userId);
        res.statusCode = 204;
        res.end('user was deleted');
    }
}