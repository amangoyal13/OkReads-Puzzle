## Code smells and issues observed during code review:
1. Data entered by user is not sanitized in terms of spaces i.e. if user enters spaces in search bar and clicks on search button, **API is being invoked with empty spaces**.
    - As part of fix have trimmed the user input.
2.  To have better performance, `formatDate()` should be replaced with **pipe** operator in `book-search.component.ts`. Pipe would evaluate the expression only when input value changes while method will be called on each change detection.
3.  `getAllBooks` selector in `book-search.component.ts` is not being unsubscribed which is not a good practice and can cause memory leak.
    - Issue has been fixed by utilizing **async pipe** which will take care of unsubscribing it once the component is destroyed.
4.  Instead of using formControl value we can directly use getter method (`searchTerm`). Implemented this in `searchBooks()`.
5.  Previous searched term on application is retained i.e. when user searches for a term and clears the input, we show them **#empty container** but on re-typing we are showing previously searched result. Improved this user experience by showing the previous results even when search input is cleared until new term is searched.
6.  Properties, variables and method names should be self explanatory. Currently `b` is used in `book-search`, `reading-list` html and `reading-list` selector. Fixed this by using **book** instead of **b**.
7.  **Data type**, **method/parameter** return type for `reading-list.component.ts` and `book-search.component.ts` is not given. The same is now **added** to keep it as per standards.
8.  Currently optimistic approach is being followed where the state is updated as soon as **addToReadingList** & **removeFromReadingList** actions are dispatched. In case of API failure, state is not reverted.
    - As part of fix, **confirmedAddToReadingList** & **confirmedRemoveFromReadingList** actions are being utilized to update the state in `reading-list.reducer.ts`.
9.  Test cases are failing for reading-list reducer for **failedAddToReadingList** and **failedRemoveFromReadingList** which have been **fixed**.
## Areas of Improvement:
1.  **Error handling** is not done for API failure and UI error implementation is missing. Same is now **implemented**.
2.  **Spinner** can be added when API is fetching result.
3.  Application is **currently not responsive**. UI can be made responsive (_breaks on mobile view_).
## Accessibility Issues
##### Found during lighthouse testing:
1.  Buttons do not have an accessible name.
    - Search button does not have any accessible name for screen reader which can help the visually impaired.
2.  Background and foreground colors do not have a sufficient contrast ratio.
    - This issue is particularly challenging for people with low vision.
    - Issue was seen on page header where the background has been changed to dark-pink.
    - Empty container text was also low in contrast so have changed it's color to dark gray.
##### Found during manual testing:
1.  Alt tag is missing for book images.
    - `alt` tag is added which can contain description of image. Here its kept empty as these are decorative images.
2.  `<a>` tag is used for search example but there is no `href` or navigation linked to it. As per accessibility standards anchor tag should have a href.
    - So changing anchor tag to button.
    - Previously *JavaScript* anchor tag was not accessible on tabbing, after changing to button keyboard accessibility is added.
3.  "Want to read" button should have book title to distinguish which book is being referred.
    - Book title has also been added with *Want to Read* CTA text to differentiate user about the books.