import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
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

  describe('markBookFinished$', () => {
    beforeEach(() => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.markBookAsFinished({ bookId: 'B', finishedDate: '2021-07-09T14:07:04.417Z' }));
    });

    it('should mark a book as finished', done => {

      effects.markBookFinished$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedMarkBookAsFinished({ bookId: 'B', finishedDate: '2021-07-09T14:07:04.417Z' })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list/B/finished').flush([]);
    });

    it('should not mark a book as finished when api returns error', done => {

      effects.markBookFinished$.subscribe(action => {
        expect(action.type).toEqual('[Reading List API] Failed to mark book as complete');
        done();
      });

      httpMock.expectOne('/api/reading-list/B/finished')
      .error(new ErrorEvent('Internal server Error'));
    });
  });
});
