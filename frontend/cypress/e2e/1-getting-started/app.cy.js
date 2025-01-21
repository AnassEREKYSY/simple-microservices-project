describe('Frontend Tests', () => {
  it('should load the frontend and display the title', () => {
    cy.visit('http://localhost:8080');
    cy.contains('Welcome to Simple Microservices');
  });
});
  