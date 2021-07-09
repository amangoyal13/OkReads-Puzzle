import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Reading List Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('failedAddToReadingList should undo book addition to the state', () => {
      const action = ReadingListActions.failedAddToReadingList({
        error: 'Add Book API Failed'
      });

      const result: State = reducer(state, action);

      expect(result.error).toEqual('Add Book API Failed');
    });

    it('failedRemoveFromReadingList should undo book removal from the state', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        error: 'Remove Book API failed'
      });

      const result: State = reducer(state, action);

      expect(result.error).toEqual('Remove Book API failed');
    });

    it('should add book to reading list', () => {
      const action = ReadingListActions.confirmedAddToReadingList({ book: createBook('D') });
      
      const result: State = reducer(state, action);

      expect(result.ids.length).toEqual(3);
    });

    it('should remove book from reading list', () => {
      const action = ReadingListActions.confirmedRemoveFromReadingList({ item: createReadingListItem('B') });

      const result: State = reducer(state, action);

      expect(result.ids.length).toEqual(1);
    });

    it('confirmedMarkBookAsFinished action should set finished date and finish attribute in state', () => {
      const action = ReadingListActions.confirmedMarkBookAsFinished({
        bookId:'B', finishedDate: '2021-07-09T14:07:04.417Z' });

      const result: State = reducer(state, action);

      expect(result.entities['B'].finished).toEqual(true);
      expect(result.entities['B'].finishedDate).toEqual('2021-07-09T14:07:04.417Z');
    });

    it('failedMarkBookAsFinished action should set error in state', () => {
      const action = ReadingListActions.failedMarkBookAsFinished({
        error: 'API Failed to update book' });

      const result: State = reducer(state, action);

      expect(result.error).toEqual('API Failed to update book');
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
