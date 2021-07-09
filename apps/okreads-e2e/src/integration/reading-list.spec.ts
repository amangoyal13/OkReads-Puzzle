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

  describe('When: I am updating book status', () => {
    beforeEach(() => {
      cy.searchAndAddBook('Deep Learning');

      cy.markBookFinished();
    });

    it('Then: I should be able to mark a book as finished and CTA label should change to Finsihed', () => {
      cy.get('[data-testing="finish-text"]').last().should('be.visible');

      cy.get('[data-testing="book-status"]:disabled').first().should('contain.text','Finished');
    });

    it('Then: On deleting book after marking it as read, CTA should change back to Want to Read', () => {
      cy.get('[data-testing="remove-from-list-button"]').last().click();

      cy.get('[data-testing="book-status"]:enabled').first().should('contain.text','Want to Read');

      cy.get('[data-testing="close-list"]').click();

      cy.get('[data-testing="book-status"]:enabled').first().click();

      cy.get('[data-testing="mark-finished"]').last().should('be.enabled');
    });
  });
});
