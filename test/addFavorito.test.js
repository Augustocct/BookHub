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

describe('GET /addFavorito', () => {
    it('deve recusar sem autenticação', async () => {
        const res = await request(app).get('/addFavorito?id=1');
        // Espera redirecionamento para login ou erro
        expect([302, 401, 403, 500]).toContain(res.status);
    });

    it('deve alternar favorito autenticado', async () => {
        const agent = await agentWithUserSession();
        const res = await agent.get('/addFavorito?id=1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('favorito');
        // O valor pode ser true ou false, pois alterna
        expect(typeof res.body.favorito).toBe('boolean');
    });

    it('deve retornar erro se livro não existe', async () => {
        const agent = await agentWithUserSession();
        const res = await agent.get('/addFavorito?id=999999');
        // Espera redirecionamento para home com erro
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/error=Livro/);
    });
});
