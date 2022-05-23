const {app, Taches} = require('../app');
const request = require('supertest');

describe('Task', () => {
    test.each([
        {description: "Description 1", faite: true},
        {description: "Description 2", faite: false},
        {description: "Description 3", faite: true}
    ])('Should pass confirmation data', async (objectTest) => {
        const result = await request(app).post('/task').send(objectTest).expect(201);
    });
});