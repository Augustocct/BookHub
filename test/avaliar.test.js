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

describe('POST /avaliar', () => {
    it('deve aceitar avaliação válida autenticado', async () => {
        const agent = await agentWithUserSession();
        const res = await agent
            .post('/avaliar?id=1&nota=4');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('sucesso', true);
    });

    it('deve retornar erro para nota inválida', async () => {
        const agent = await agentWithUserSession();
        const res = await agent
            .post('/avaliar?id=1&nota=abc');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('sucesso', false);
    });
});
