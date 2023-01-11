import { User } from '../entities/User';

export class UserRepository {
    private users: { [id: string] : User } = {};

    private static checkRequiredFieldsNotEmpty(user: User) {
        return user.id && user.age && user.userName && user.hobbies;
    }

    get(id: string) {
        return this.users[id]?.clone();
    };

    getAll() {
        return Object.values(this.users).map(x => x.clone());
    };

    save(user: User) {
        if (!UserRepository.checkRequiredFieldsNotEmpty(user)) {
            throw new Error('required fields cannot be empty');
        }
        this.users[user.id] = user;
    };

    delete(id: string) {
        if (this.users[id]) {
            throw new Error('object with this id does not exist');
        }
        delete this.users[id];
    };
}