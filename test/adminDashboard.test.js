const request = require('supertest');
const app = require('../app');

// Mock de sessão de admin para autenticação
function agentWithAdminSession() {
    const agent = request.agent(app);
    // Simula login de admin
    return new Promise((resolve) => {
        agent
            .post('/admin/login')
            .send({ admemail: 'admTeste@gmail.com', admsenha: 'admSenha' })
            .end(() => resolve(agent));
    });
}

describe('Admin dashboard', () => {
    it('GET /admin/dashboard deve exigir autenticação', async () => {
        const res = await request(app).get('/admin/dashboard');
        // Espera redirecionamento para login se não autenticado
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/login/);
    });

    it('GET /admin/dashboard deve retornar 200 para admin autenticado', async () => {
        const agent = await agentWithAdminSession();
        const res = await agent.get('/admin/dashboard');
        expect(res.status).toBe(200);
        expect(res.text).toMatch(/BookHub/); // Verifica se renderizou a página
    });
});
