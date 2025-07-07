describe('Admin dashboard', () => {
    it('GET /admin/dashboard deve exigir autenticação', () => {
        cy.visit('/admin/dashboard');
        cy.url().should('include', '/login');
    });

    it('GET /admin/dashboard deve retornar 200 para admin autenticado', () => {
        cy.visit('/admin/login');
        cy.get('input[name="admemail"]').type('admTeste@gmail.com');
        cy.get('input[name="admsenha"]').type('admSenha');
        cy.get('form').submit();
        cy.url().should('include', '/admin/dashboard');
        cy.contains('BookHub');
    });
});
