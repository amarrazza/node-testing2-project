const Users = require('./users/users-model')
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async () => {
    await db('users').truncate();
})

test('verify using correct enviornment', () => {
    expect(process.env.NODE_ENV).toBe('testing');
})

describe('test the users model', () => {
    test('table is empty', async () => {
        const users = await db('users')
        expect(users).toHaveLength(0)
    })
    
    test('users can get inserted', async () => {
        let result = await Users.insert({ name: 'ludvig' })
        expect(result).toEqual({ name: 'ludvig', id: 1 })
        let users = await db('users')
        expect(users).toHaveLength(1)
    })

    test('can get by id', async () => {
        const {id} = await Users.insert({ name: 'mike' });
        const result = await Users.getById(id);
        expect(result).toHaveProperty('name', 'mike');
    });
})

describe('test endpoints', () => {
    test('call the up endpoint', async () => {
        const result = await request(server).get('/')
        expect(result.status).toBe(200);
        expect(result.body).toEqual({ api: 'up' })
    })
    
    test('GET /users', async () => {
        let result = await request(server).get('/users')
        expect(result.body).toBeInstanceOf(Array)
        expect(result.body).toHaveLength(0)
        
        await Users.insert({ name: 'ludvig' });
        
        result = await request(server).get('/users');
        expect(result.body).toHaveLength(1);
    })
    
    test('GET /users/id', async () => {
        const post = await Users.insert({ name: 'austin' })
        const result = await request(server).get(`/users/${post.id}`)
        expect(result.body.name).toBe('austin')
        
    })

    test('[POST] /users', async () => {
        let result = await request(server)
            .post('/users')
            .send({ name: 'alaan' });
        expect(result.status).toBe(201);

        result = await Users.getById(1);
        expect(result.name).toBe('alaan');
    });

    test('[DELETE] /users/:id', async () => {
        let {id} = await Users.insert({ name: 'Dave' });
        let result = await request(server).delete('/users/' + id);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual({ name: 'Dave', id: 1 });
        const users = await db('users');
        expect(users).toHaveLength(0);
    });

    test('[PUT] /users/:id', async () => {
        let {id} = await Users.insert({ name: 'rud' });
        let result = await request(server)
            .put('/users/' + id)
            .send({ name: 'alex' });
        expect(result.body).toEqual({ name: 'alex', id });
        let user = await Users.getById(id);
        expect(user).toEqual({ name: 'alex', id })
    });

})