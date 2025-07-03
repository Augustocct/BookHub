const request = require('supertest');
const app = require('../app');

describe('Cobertura extra de erros e branches', () => {
    it('GET /favoritos sem login deve redirecionar', async () => {
        const res = await request(app).get('/favoritos');
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/login/);
    });

    it('POST /logar com usuário inválido', async () => {
        const res = await request(app)
            .post('/logar')
            .send({ email: 'naoexiste@teste.com', senha: 'senhaerrada' });
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/login\?error/);
    });

    it('POST /comentar sem login deve redirecionar', async () => {
        const res = await request(app)
            .post('/comentar')
            .send({ livroId: 1, mensagem: 'Teste' });
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/login/);
    });
});
