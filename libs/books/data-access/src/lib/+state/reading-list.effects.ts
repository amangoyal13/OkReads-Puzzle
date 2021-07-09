import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, tap } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book, showSnackBar }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book, showSnackBar })),
          catchError((error) =>
            of(ReadingListActions.failedAddToReadingList({ error: error.message }))
          )
        )
      )
    )
  );

  confirmedAddToReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedAddToReadingList),
      tap(({ book, showSnackBar }) => {
        if (showSnackBar) {
          this.openSnackBar("Book added to reading list successfully", book, true);
        }
      })
    ),
    { dispatch: false }
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, showSnackBar }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item, showSnackBar })
          ),
          catchError((error) =>
            of(ReadingListActions.failedRemoveFromReadingList({ error: error.message }))
          )
        )
      )
    )
  );

  confirmedRemoveFromReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedRemoveFromReadingList),
      tap(({ item, showSnackBar }) => {
        if (showSnackBar) {
          this.openSnackBar("Book removed from reading list successfully", item, false)
        }
      })
    ),
    { dispatch: false }
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }


  openSnackBar(message: string, payload, remove: boolean) {
    this.snackBar.open(message, "Undo", { duration: 5000 })
      .onAction()
      .subscribe(() => {
        if (remove) {
          this.store.dispatch(ReadingListActions.removeFromReadingList({ item: { bookId: payload.id, ...payload }, showSnackBar: false }));
        }
        else {
          this.store.dispatch(ReadingListActions.addToReadingList({ book: { id: payload.bookId, ...payload }, showSnackBar: false }));
        }
      });
  }
  
  constructor(private actions$: Actions, private http: HttpClient, private snackBar: MatSnackBar, private store: Store) {}
}
