describe('Cobertura extra de erros e branches', () => {
    it('GET /favoritos sem login deve redirecionar', () => {
        cy.visit('/favoritos');
        cy.url().should('include', '/login');
    });

    it('POST /logar com usuário inválido', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type('naoexiste@teste.com');
        cy.get('input[name="senha"]').type('senhaerrada');
        cy.get('form').submit();
        cy.url().should('include', 'login?error');
    });

    it('POST /comentar sem login deve redirecionar', () => {
        cy.visit('/descricao?id=1');
        cy.get('form[action="/comentar"]').should('not.exist');
        cy.visit('/login');
    });
});
