# API documentation


## Authentication -> /

* login/
Forwards to the Google oauth2 login screen.
The login returns the cookies sessionId and csrftoken. For reading of the API only the sessionId cookie is required.
For write access the csrftoken must also be given in the header X-CSRFToken.

* logout/
Removes the session from the Django authentication system.


## UserProfile -> /api/userProfile

* /
Allowed method: GET
Required arguments: None
Optional arguments: None
Description: Returns details about the logged in user.


## Books -> /api/book

* /<book_id>/
Allowed method: GET
Required arguments: None
Optional arguments: book_id
Description: Returns a list of all books or a single book.

* /<book_id>/copies/
Allowed method: GET
Required arguments: book_id
Optional arguments: None
Description: Returns all physical copies of a book.

* /new/
Allowed method: GET
Required arguments: None
Optional arguments: None
Description: Returns a list of the last 10 books added to the library.


## Search -> /api/search

* /<search_term>/
Allowed method: GET
Required arguments: searchTerm
Optional arguments: None
Description: Returns a full text search of books in the database.


## Loan -> /api/loan

* /reserved/
Allowed method: GET, POST
Required arguments: None
Optional arguments: None
Description: Return a list of all reserved loans, of the logged in user, or create a new one.

* /reserved/<loan_id>/
Allowed method: GET, DELETE
Required arguments: loan_id
Optional arguments: None
Description: Return a reserved loan, of the logged in user, or delete one.

* /active/
Allowed method: GET
Required arguments: None
Optional arguments: None
Description: Return a list of all active loans, of the logged in user.

* /active/<loan_id>/
Allowed method: GET, DELETE
Required arguments: loan_id
Optional arguments: None
Description: Return a active loan, of the logged in user, or delete one.

* /history/
Allowed method: GET
Required arguments: None
Optional arguments: None
Description: Return a list of all prior active loans, of the logged in user.

* /history/<loan_id>/
Allowed method: GET
Required arguments: loan_id
Optional arguments: None
Description: Return a prior active loan, of the logged in user.
