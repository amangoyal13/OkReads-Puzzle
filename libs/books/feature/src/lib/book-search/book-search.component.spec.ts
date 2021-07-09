import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { getAllBooks } from '@tmo/books/data-access';

describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [
        provideMockStore({
          initialState: {
            books: {
              entities: []
            }
          },
          selectors: [{
            selector: getAllBooks,
            value: []
          }]
        })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Search Action should be dispatched only after interval of 500ms', fakeAsync(() => {
    component.searchForm.controls.term.setValue('javascript');

    expect(store.dispatch).not.toHaveBeenCalled();

    tick(500);

    expect(store.dispatch).toHaveBeenCalledWith({ type: "[Books Search Bar] Search", term: 'javascript' });
    })
  );


  it('should dispatch Clear Search Action when input provided by user is empty', fakeAsync(() => {
    component.searchForm.controls.term.setValue('');
    tick(500);

    expect(store.dispatch).toHaveBeenCalledWith({ type: "[Books Search Bar] Clear Search" });
    })
  );

  it('should not dispatch multiple search book action for same term (distinctUntilChanged)', fakeAsync(() => {
    component.searchForm.controls.term.setValue('Python');
    tick(500);

    component.searchForm.controls.term.setValue('Python');
    tick(500);

    expect(store.dispatch).toHaveBeenCalledWith({ type: "[Books Search Bar] Search", term: 'Python' });
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    })
  );

  it('should unsubscribe to searchStream observable once component is destroyed (ngOnDestroy)', fakeAsync(() => {
    component.ngOnDestroy();
    component.searchForm.controls.term.setValue('Python');

    tick(500);

    expect(store.dispatch).not.toHaveBeenCalled();
    })
  );
});
