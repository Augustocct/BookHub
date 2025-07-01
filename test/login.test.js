const request = require('supertest');
const app = require('../app');

describe('Rotas principais', function () {
    it('GET / deve retornar 200', function (done) {
        request(app)
            .get('/')
            .expect(200, done);
    });

    it('GET /login deve retornar 200', function (done) {
        request(app)
            .get('/login')
            .expect(200, done);
    });

    it('POST /novoUser deve registrar usuário', function (done) {
        request(app)
            .post('/novoUser')
            .send({
                nome: 'Teste',
                email: 'teste@teste.com',
                senhaA: '12345678',
                senhaB: '12345678'
            })
            .expect(302) // espera redirecionamento
            .end(done);
    });

    // Adicione mais testes para outras rotas conforme necessário
});