const request = require('supertest');
const app = require('../app');

describe('Cobertura extra de rotas públicas', () => {
    it('GET /register deve retornar 200', async () => {
        const res = await request(app).get('/register');
        expect(res.status).toBe(200);
        expect(res.text).toMatch(/Registro/);
    });

    it('GET /login deve retornar 200', async () => {
        const res = await request(app).get('/login');
        expect(res.status).toBe(200);
        expect(res.text).toMatch(/login/i);
    });

    it('GET /logout deve redirecionar', async () => {
        const res = await request(app).get('/logout');
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe('/');
    });

    it('GET /detalhesPerfil sem login deve redirecionar', async () => {
        const res = await request(app).get('/detalhesPerfil');
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/login/);
    });

    it('GET /perfil sem login deve redirecionar', async () => {
        const res = await request(app).get('/perfil');
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/login/);
    });

    it('GET /livros com busca', async () => {
        const res = await request(app).get('/livros?inputBusca=Harry');
        expect(res.status).toBe(200);
        expect(res.text).toMatch(/BookHub/);
    });

    it('GET /livros com categoria', async () => {
        const res = await request(app).get('/livros?categoria=1');
        expect(res.status).toBe(200);
        expect(res.text).toMatch(/BookHub/);
    });

    it('GET /descricao com livro inexistente', async () => {
        const res = await request(app).get('/descricao?id=999999');
        expect(res.status).toBe(200);
        expect(res.text).toMatch(/erro/i);
    });
});
