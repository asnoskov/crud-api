export class User {
    constructor (public id: string, public userName: string, public age: number, public hobbies: string[]) {};

    public clone(): User {
        return new User(this.id, this.userName, this.age, [...this.hobbies]);
    }
}