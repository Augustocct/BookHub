const request = require('supertest');
const app = require('../app');

// Função utilitária para simular login de admin
function agentWithAdminSession() {
    const agent = request.agent(app);
    return new Promise((resolve) => {
        agent
            .post('/admin/login')
            .send({ admemail: 'admTeste@gmail.com', admsenha: 'admSenha' })
            .end(() => resolve(agent));
    });
}

describe('POST /admin/atualizaLivro', () => {
    it('deve exigir autenticação', async () => {
        const res = await request(app)
            .post('/admin/atualizaLivro?id=1')
            .send({ titulo: 'Novo Título', descricao: 'Nova descrição', capa_url: 'url.jpg', pdf_url: 'pdf.pdf' });
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/login/);
    });

    it('deve atualizar livro autenticado', async () => {
        const agent = await agentWithAdminSession();
        const res = await agent
            .post('/admin/atualizaLivro?id=1')
            .send({ titulo: 'Novo Título', descricao: 'Nova descrição', capa_url: 'url.jpg', pdf_url: 'pdf.pdf' });
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/admDescricao\?id=1&atualizado=true/);
    });

});
