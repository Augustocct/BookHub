const request = require('supertest');
const app = require('../app');

// Função utilitária para simular login de usuário
function agentWithUserSession() {
    const agent = request.agent(app);
    return new Promise((resolve) => {
        agent
            .post('/logar')
            .send({ email: 'augustoconte@gmail.com', senha: '12345678' })
            .end(() => resolve(agent));
    });
}

describe('POST /comentar', () => {
    it('deve exigir autenticação', async () => {
        const res = await request(app)
            .post('/comentar')
            .send({ livroId: 1, mensagem: 'Comentário sem login' });
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/login/);
    });

    it('deve recusar comentário vazio', async () => {
        const agent = await agentWithUserSession();
        const res = await agent
            .post('/comentar')
            .send({ livroId: 1, mensagem: '' });
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/error=Coment%C3%A1rio%20n%C3%A3o%20pode%20ser%20vazio/);
    });

    it('deve aceitar comentário válido', async () => {
        const agent = await agentWithUserSession();
        const res = await agent
            .post('/comentar')
            .send({ livroId: 1, mensagem: 'Comentário de teste' });
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/descricao\?id=1/);
    });
});
