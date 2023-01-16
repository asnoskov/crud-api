import request from 'supertest';
import * as dotenv from 'dotenv';
import * as uuid from 'uuid';

dotenv.config();
const apiUrl = `http://localhost:${process.env.API_PORT}`;

test('GET /users should return empty list of users', async () => {
    const response = await request(apiUrl)
        .get(`/api/users/`)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200);

    expect(response.text).toBe("[]");
});

test('POST /users should create new user', async () => {
    const userToCreate = {
        userName: 'Test user',
        age: 30,
        hobbies: ['dancing', 'hiking']
    };
    const requestBody = JSON.stringify(userToCreate);
    const response = await request(apiUrl)
        .post(`/api/users/`)
        .send(requestBody)
        .set('Accept', 'application/json')
        .expect(201);
    
    const createdUser = JSON.parse(response.text);
    expect(createdUser.id).toBeDefined();
    expect(createdUser.userName).toBe(userToCreate.userName);
    expect(createdUser.age).toBe(userToCreate.age);
    expect(createdUser.hobbies.length).toBe(userToCreate.hobbies.length);
});

test('GET /users/{userId} should return created user', async () => {
    const userToCreate = {
        userName: 'Test user 2',
        age: 35,
        hobbies: ['programming', 'listening music']
    };

    const requestBody = JSON.stringify(userToCreate);
    const createUserResponse = await request(apiUrl)
        .post(`/api/users/`)
        .send(requestBody)
        .set('Accept', 'application/json')
        .expect(201);
    const createdUser = JSON.parse(createUserResponse.text);

    const response = await request(apiUrl)
        .get(`/api/users/${createdUser.id}`)
        .set('Accept', 'application/json')
        .expect(200);
    
    const returnedUser = JSON.parse(response.text);
    expect(returnedUser.id).toBe(createdUser.id);
    expect(returnedUser.userName).toBe(createdUser.userName);
    expect(returnedUser.age).toBe(createdUser.age);
    expect(returnedUser.hobbies.length).toBe(createdUser.hobbies.length);
});

test('DELETE /users/{userId} should delete user or return 404 is not exist', async () => {
    const userToCreate = {
        userName: 'Test user 3',
        age: 35,
        hobbies: ['playing guitar']
    };

    const requestBody = JSON.stringify(userToCreate);
    const createUserResponse = await request(apiUrl)
        .post(`/api/users/`)
        .send(requestBody)
        .set('Accept', 'application/json')
        .expect(201);
    const userId = JSON.parse(createUserResponse.text).id;

    await request(apiUrl)
        .get(`/api/users/${userId}`)
        .set('Accept', 'application/json')
        .expect(200);
    
    await request(apiUrl)
        .delete(`/api/users/${userId}`)
        .set('Accept', 'application/json')
        .expect(204);

    await request(apiUrl)
        .get(`/api/users/${userId}`)
        .set('Accept', 'application/json')
        .expect(404);

    await request(apiUrl)
        .delete(`/api/users/${userId}`)
        .set('Accept', 'application/json')
        .expect(404);
});

test('GET /users/{userId} should return 404 for not existing user id', async () => {
    const notExistingUserId = uuid.v4();

    await request(apiUrl)
        .get(`/api/users/${notExistingUserId}`)
        .set('Accept', 'application/json')
        .expect(404);
});

test('UPDATE /users/{userId} should update existing user', async () => {
    const existingUsersResponse = await request(apiUrl)
        .get(`/api/users/`)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200);
    const existingUser = JSON.parse(existingUsersResponse.text)[0];
    
    const newUserName = 'Updated user name';
    const newAge = 20;
    const newHobbies = ['gaming'];

    const updatedUser = {
        ...existingUser,
        userName: newUserName,
        age: newAge,
        hobbies: newHobbies
    }

    const updateUserResponse = await request(apiUrl)
        .put(`/api/users/${existingUser.id}`)
        .send(JSON.stringify(updatedUser))
        .set('Accept', 'application/json')
        .expect(200);

    const updatedUserFromApi = JSON.parse(updateUserResponse.text);
    expect(updatedUserFromApi.id).toBe(existingUser.id);
    expect(updatedUserFromApi.userName).toBe(newUserName);
    expect(updatedUserFromApi.age).toBe(newAge);
    expect(updatedUserFromApi.hobbies.length).toBe(newHobbies.length);
});