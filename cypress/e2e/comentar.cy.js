describe('POST /comentar', () => {
    it('deve exigir autenticação', () => {
        cy.visit('/descricao?id=1');
        cy.get('form[action="/comentar"]').should('not.exist');
        cy.visit('/login');
    });

    it('deve recusar comentário vazio', () => {
        cy.login('augustoconte@gmail.com', '12345678');
        cy.visit('/descricao?id=1');
        cy.get('form[action="/comentar"] textarea[name="mensagem"]').clear();
        cy.get('form[action="/comentar"]').submit();
        cy.url().should('include', 'error=Coment%C3%A1rio%20não%20pode%20ser%20vazio');
    });

    it('deve aceitar comentário válido', () => {
        cy.login('augustoconte@gmail.com', '12345678');
        cy.visit('/descricao?id=1');
        cy.get('form[action="/comentar"] textarea[name="mensagem"]').type('Comentário de teste');
        cy.get('form[action="/comentar"]').submit();
        cy.url().should('include', '/descricao?id=1');
    });
});

// Adicione um comando customizado em cypress/support/commands.js:
// Cypress.Commands.add('login', (email, senha) => {
//   cy.visit('/login');
//   cy.get('input[name="email"]').type(email);
//   cy.get('input[name="senha"]').type(senha);
//   cy.get('form').submit();
// });
