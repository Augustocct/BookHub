const request = require('supertest');
const app = require('../app');

describe('Cobertura extra de POSTs e fluxos de erro', () => {
    it('POST /novoUser com senha curta', async () => {
        const res = await request(app)
            .post('/novoUser')
            .send({ nome: 'Teste', email: 'teste@teste.com', senhaA: '123', senhaB: '123' });
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/error=Senha/);
    });

    it('POST /novoUser com senhas diferentes', async () => {
        const res = await request(app)
            .post('/novoUser')
            .send({ nome: 'Teste', email: 'teste@teste.com', senhaA: '12345678', senhaB: '87654321' });
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/error=Senhas/);
    });

    it('POST /atualizarPerfil com senha curta', async () => {
        const agent = request.agent(app);
        await agent.post('/logar').send({ email: 'teste@teste.com', senha: '12345678' });
        const res = await agent.post('/atualizarPerfil').send({ nome: 'Teste', email: 'teste@teste.com', senha: '123' });
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/error=Senha/);
    });

    it('GET /perfil com usuário inexistente', async () => {
        const agent = request.agent(app);
        await agent.post('/logar').send({ email: 'naoexiste@teste.com', senha: '12345678' });
        const res = await agent.get('/perfil');
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/error=Usuário/);
    });
});
