describe('Frontend Tests', () => {
  it('should load the frontend and display the title', () => {
    cy.visit('/');
    cy.contains('Welcome to Simple Microservices');
  });
});
  