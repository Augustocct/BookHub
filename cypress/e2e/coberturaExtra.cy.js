describe('Cobertura extra de rotas públicas', () => {
    it('GET /register deve retornar 200', () => {
        cy.visit('/register');
        cy.contains('Registro');
    });

    it('GET /login deve retornar 200', () => {
        cy.visit('/login');
        cy.contains(/login/i);
    });

    it('GET /logout deve redirecionar', () => {
        cy.visit('/logout');
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('GET /detalhesPerfil sem login deve redirecionar', () => {
        cy.visit('/detalhesPerfil');
        cy.url().should('include', '/login');
    });

    it('GET /perfil sem login deve redirecionar', () => {
        cy.visit('/perfil');
        cy.url().should('include', '/login');
    });

    it('GET /livros com busca', () => {
        cy.visit('/livros?inputBusca=Harry');
        cy.contains('BookHub');
    });

    it('GET /livros com categoria', () => {
        cy.visit('/livros?categoria=1');
        cy.contains('BookHub');
    });

    it('GET /descricao com livro inexistente', () => {
        cy.visit('/descricao?id=999999');
        cy.contains(/erro/i);
    });
});
