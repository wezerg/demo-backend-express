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
    test('Should not find object', async () => {
        const result = await request(app).get('/task/136').send().expect(400);
    });
    test('Should find object', async () => {
        const sendData = await request(app).post('/task').send({description: "Hello World", faite: false}).expect(201);
        console.log(Taches.getAll());
        const result = await request(app).get('/task/3').send().expect(200);
    });
});