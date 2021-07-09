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
      markBookFinished: typeof markBookFinished;
    }
  }
}

export function startAt(url) {
  cy.visit(url);
  cy.get('tmo-root').should('contain.text', 'okreads');
}

export function searchAndAddBook(searchTerm: string) : void {
  cy.get('input[type="search"]').type(searchTerm);
  cy.get('form').submit();
  cy.get('[data-testing="book-status"]:enabled').first().click();
}

export function markBookFinished(): void {
  cy.get('[data-testing="toggle-reading-list"]').click();
  cy.get('[data-testing="mark-finished"]').last().click();
}

Cypress.Commands.add('startAt', startAt);
Cypress.Commands.add('searchAndAddBook', searchAndAddBook);
Cypress.Commands.add('markBookFinished', markBookFinished); 
