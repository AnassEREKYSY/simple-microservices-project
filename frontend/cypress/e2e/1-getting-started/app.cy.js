describe('User Interaction', () => {
    it('should load the page and interact with the form', () => {
      cy.visit('http://localhost:8080');
      cy.get('input[name="name"]').type('John Doe');
      cy.get('input[name="email"]').type('john@example.com');
      cy.get('button').click();
      cy.contains('User created successfully');
    });
  });
  