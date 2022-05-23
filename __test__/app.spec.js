const {app, Taches} = require('../app');
const request = require('supertest');

describe('Task', () => {
    test.each([
        {id: 1, description: "Description 1", faite: true},
        {id: 2, description: "Description 2", faite: false},
        {id: 3, description: "Description 3", faite: true},
        {id: 4, description: "Description 4", faite: false},
        {id: 5, description: "Description 5", faite: true}
    ])('Should pass confirmation data', async (objectTest) => {
        const result = await request(app).post('/task').send(objectTest).expect(201)
    });
});