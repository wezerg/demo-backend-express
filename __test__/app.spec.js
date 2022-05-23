const {app, Taches, Users} = require('../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config();

afterEach(() => {
    Taches.memoryDb = new Map();
    Taches.id = 0;
    Users.memoryDb = new Map();
    Users.id = 0;
});

describe('Task', () => {
    test('Should pass confirmation data', async () => {
        const register = await request(app).post('/register').send({email: "email@email.com", username: "vivian", password: "1234"}).expect(201);
        const login = await request(app).post('/login').send({email: "email@email.com", password: "1234"}).expect(200);
        const result = await request(app).post('/task').set('x-auth-token', login.headers['x-auth-token']).send({description: "Description 1", faite: true}).expect(201);
        let userInToken = "";
        try {
            userInToken = jwt.verify(login.headers['x-auth-token'], process.env.SECRET_KEY);
        } catch (error) {
            throw new Error('Le token est invalide');
        }
        expect(parseInt(result.body.creePar)).toBe(parseInt(userInToken.id));
    });
    test('Should not find object', async () => {
        const result = await request(app).get('/task/136').send().expect(400);
    });
    test('Should find object', async () => {
        const register = await request(app).post('/register').send({email: "email@email.com", username: "vivian", password: "1234"}).expect(201);
        const login = await request(app).post('/login').send({email: "email@email.com", password: "1234"}).expect(200);
        const sendData = await request(app).post('/task').set('x-auth-token', login.headers['x-auth-token']).send({description: "Hello World", faite: false}).expect(201); // Ici
        const result = await request(app).get('/task/0').send().expect(200);
    });
});

describe('Task Update', () => {
    test('Should update one entry', async () => {
        const register = await request(app).post('/register').send({email: "email@email.com", username: "vivian", password: "1234"}).expect(201);
        const login = await request(app).post('/login').send({email: "email@email.com", password: "1234"}).expect(200);
        const result = await request(app).post('/task').set('x-auth-token', login.headers['x-auth-token']).send({description: "Desciption 1", faite: false}).expect(201);
        const modif = await request(app).put('/task/0').set('x-auth-token', login.headers['x-auth-token']).send({description: "Description1", faite: true}).expect(200);
        expect(modif.body.faite).toBe(true);
    });
});

describe('Task Delete', () => {
    test('Should delete one entry', async () => {
        const register = await request(app).post('/register').send({email: "email@email.com", username: "vivian", password: "1234"}).expect(201);
        const login = await request(app).post('/login').send({email: "email@email.com", password: "1234"}).expect(200);
        const result = await request(app).post('/task').set('x-auth-token', login.headers['x-auth-token']).send({description: "Desciption 1", faite: false}).expect(201);
        const deleted = await request(app).delete('/task/0').set('x-auth-token', login.headers['x-auth-token']).send({description: "Description1", faite: true}).expect(200);
        expect(Taches.memoryDb.entries.length).toBe(0);
    });

    test('Should not delete task of other user', async () => {
        const register1 = await request(app).post('/register').send({email: "email@email.com", username: "vivian", password: "1234"}).expect(201);
        const login1 = await request(app).post('/login').send({email: "email@email.com", password: "1234"}).expect(200);
        const register2 = await request(app).post('/register').send({email: "email@gmail.com", username: "Marc", password: "1234"}).expect(201);
        const login2 = await request(app).post('/login').send({email: "email@gmail.com", password: "1234"}).expect(200);
        const result = await request(app).post('/task').set('x-auth-token', login1.headers['x-auth-token']).send({description: "Desciption 1", faite: false}).expect(201);
        const deleted = await request(app).delete('/task/0').set('x-auth-token', login2.headers['x-auth-token']).send({description: "Description1", faite: true}).expect(400);
    });
});

describe('Register & Login', () => {
    test.each([
        {email: "Jean@example.com", username: "Jean", password: "1234"},
        {email: "Lila@example.com", username: "Lila", password: "1234"},
        {email: "Fabien@example.com", username: "Fabien", password: "1234"},
    ])('Should register and login', async (objectTest) => {
        const register = await request(app).post('/register').send(objectTest).expect(201);
        delete objectTest.username;
        const login = await request(app).post('/login').send(objectTest).expect(200);
    });
});