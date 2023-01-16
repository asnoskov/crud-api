import request from 'supertest';

const apiUrl = 'http://localhost:3000';

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
        //.expect('Content-Type', 'application/json')
        .expect(201);
    
    const createdUser = JSON.parse(response.text);
    expect(createdUser.id).toBeDefined();
    expect(createdUser.userName).toBe(userToCreate.userName);
    expect(createdUser.age).toBe(userToCreate.age);
    expect(createdUser.hobbies.length).toBe(userToCreate.hobbies.length);
});

test('GET /users/{userId} should return requested user', async () => {
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
        //.expect('Content-Type', 'application/json')
        .expect(201);
    const createdUser = JSON.parse(createUserResponse.text);

    const response = await request(apiUrl)
        .get(`/api/users/${createdUser.id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200);
    
    const returnedUser = JSON.parse(response.text);
    expect(returnedUser.id).toBe(createdUser.id);
    expect(returnedUser.userName).toBe(createdUser.userName);
    expect(returnedUser.age).toBe(createdUser.age);
    expect(returnedUser.hobbies.length).toBe(createdUser.hobbies.length);
});