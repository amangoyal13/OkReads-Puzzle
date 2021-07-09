describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  describe('When: Using SnackBar', () => {

    it('Then: On adding book to reading list I should be able to undo that action', () => {
      const initialReadingBookLength = cy.$$('.reading-list-item').length;
      
      cy.searchAndAddBook('java')

      cy.get('.mat-simple-snackbar').should('be.visible');

      cy.get('.reading-list-item').should('have.length',
        initialReadingBookLength + 1);

      cy.get('.mat-simple-snackbar-action').click();

      cy.get('.reading-list-item').should('have.length',
        initialReadingBookLength);
    });

    it('Then: On removing book from reading list I should be able to undo that action', () => {
      const initialReadingBookLength = cy.$$('.reading-list-item').length;
      
      cy.searchAndAddBook('javascript')

      cy.get('.reading-list-item').should('have.length',
        initialReadingBookLength + 1);

      cy.get('[data-testing="toggle-reading-list"]').click();

      cy.get('[data-testing="remove-from-list-button"]').first().click();

      cy.get('.mat-simple-snackbar').should('be.visible');

      cy.get('.reading-list-item').should('have.length',
        initialReadingBookLength);

      cy.get('.mat-simple-snackbar-action').last().click();

      cy.get('.reading-list-item').should('have.length',
        initialReadingBookLength + 1);
    });
  });
});
