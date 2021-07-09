import { TestBed } from '@angular/core/testing';
import { EMPTY, ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, MatSnackBarModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore(),
        {
          provide: MatSnackBar, useClass:
            class MockMatSnackBar {
              open() {
                return { onAction: () => EMPTY }
              }
            }
        }
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
    snackBar = TestBed.inject(MatSnackBar);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('confirmedAddToReadingList$', () => {
    it('should open snackbar when user adds book to reading list', done => {
      actions = new ReplaySubject();
      const book = createBook('B');
      spyOn(snackBar, 'open').and.callThrough();
      actions.next(ReadingListActions.confirmedAddToReadingList({ book: book, showSnackBar: true }));

      effects.confirmedAddToReadingList$.subscribe(() => {
        expect(snackBar.open).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('confirmedRemoveFromReadingList$', () => {
    it('should open snackbar when user removes book from reading list', done => {
      actions = new ReplaySubject();
      const item = createReadingListItem('B');
      spyOn(snackBar, 'open').and.callThrough();
      actions.next(ReadingListActions.confirmedRemoveFromReadingList({ item: item, showSnackBar: true }));

      effects.confirmedRemoveFromReadingList$.subscribe(() => {
        expect(snackBar.open).toHaveBeenCalled();
        done();
      });
    });
  });
});
