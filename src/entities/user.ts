export class User {
    constructor (public id: string, public userName: string, public age: number, public hobbies: string[]) {};

    public clone(): User {
        return new User(this.id, this.userName, this.age, [...this.hobbies]);
    }

    checkIsValid(): boolean {
        return !!(this.id && typeof this.id === 'string'
            && this.userName && typeof this.userName === 'string'
            && this.age && typeof this.age === 'number'
            && this.hobbies && Array.isArray(this.hobbies));
    }
}