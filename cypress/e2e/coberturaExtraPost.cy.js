describe('Cobertura extra de POSTs e fluxos de erro', () => {
    it('POST /novoUser com senha curta', () => {
        cy.visit('/register');
        cy.get('input[name="nome"]').type('Teste');
        cy.get('input[name="email"]').type('teste@teste.com');
        cy.get('input[name="senhaA"]').type('123');
        cy.get('input[name="senhaB"]').type('123');
        cy.get('form').submit();
        cy.url().should('include', 'error=Senha');
    });

    it('POST /novoUser com senhas diferentes', () => {
        cy.visit('/register');
        cy.get('input[name="nome"]').type('Teste');
        cy.get('input[name="email"]').type('teste@teste.com');
        cy.get('input[name="senhaA"]').type('12345678');
        cy.get('input[name="senhaB"]').type('87654321');
        cy.get('form').submit();
        cy.url().should('include', 'error=Senhas');
    });

    it('POST /atualizarPerfil com senha curta', () => {
        cy.login('teste@teste.com', '12345678');
        cy.visit('/detalhesPerfil');
        cy.get('input[name="senha"]').clear().type('123');
        cy.get('form').submit();
        cy.url().should('include', 'error=Senha');
    });

    it('GET /perfil com usuário inexistente', () => {
        cy.login('naoexiste@teste.com', '12345678');
        cy.visit('/perfil');
        cy.url().should('include', 'error=Usuário');
    });
});
