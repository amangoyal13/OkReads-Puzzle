// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      startAt: typeof startAt;
      searchAndAddBook: typeof searchAndAddBook;
    }
  }
}

export function startAt(url) {
  cy.visit(url);
  cy.get('tmo-root').should('contain.text', 'okreads');
}

export function searchAndAddBook(searchTerm: string): void {
  cy.get('input[type="search"]').type(searchTerm);
  cy.get('form').submit();
  cy.get('[data-testing="add-to-list-button"]:enabled').first().click();
}

Cypress.Commands.add('startAt', startAt);
Cypress.Commands.add('searchAndAddBook', searchAndAddBook);