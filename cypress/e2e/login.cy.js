describe('Rotas principais', () => {
    it('GET / deve retornar 200', () => {
        cy.visit('/');
        cy.contains('BookHub');
    });

    it('GET /login deve retornar 200', () => {
        cy.visit('/login');
        cy.contains(/login/i);
    });

    it('POST /novoUser deve registrar usuário', () => {
        cy.visit('/register');
        cy.get('input[name="nome"]').type('Teste');
        cy.get('input[name="email"]').type('teste@teste.com');
        cy.get('input[name="senhaA"]').type('12345678');
        cy.get('input[name="senhaB"]').type('12345678');
        cy.get('form').submit();
        cy.url().should('include', 'novoUser=true');
    });
});
