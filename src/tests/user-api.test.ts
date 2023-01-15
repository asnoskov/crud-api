import assert from 'assert';
import request from 'supertest';

const apiUrl = 'http://localhost:3000';

test('GET /users returns empty list of users', async () => {
    const response = await request(apiUrl)
        .get(`/api/users/`)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200);

    assert(response.body, '[]');
});