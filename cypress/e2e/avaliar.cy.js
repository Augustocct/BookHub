describe('POST /avaliar', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[name="email"]').type('augustoconte@gmail.com');
        cy.get('input[name="senha"]').type('12345678');
        cy.get('form').submit();
    });

    it('deve aceitar avaliação válida autenticado', () => {
        cy.visit('/descricao?id=1');
        cy.get('#rating .star[data-value="4"]').click();
        cy.contains('Avaliação');
    });
});
