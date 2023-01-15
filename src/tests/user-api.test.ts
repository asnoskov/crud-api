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
    const userToSend = {
        userName: 'Test user',
        age: 30,
        hobbies: ['dancing', 'hiking']
    };
    const requestBody = JSON.stringify(userToSend);
    const response = await request(apiUrl)
        .post(`/api/users/`)
        .send(requestBody)
        .set('Accept', 'application/json')
        //.expect('Content-Type', 'application/json')
        .expect(201);
    
    const createdUser = JSON.parse(response.text);
    expect(createdUser.id).toBeDefined();
    expect(createdUser.userName).toBe(userToSend.userName);
    expect(createdUser.age).toBe(userToSend.age);
    expect(createdUser.hobbies.length).toBe(userToSend.hobbies.length);
});