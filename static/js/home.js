$("document").ready(function() {
  $(".sidenav").sidenav();
  loadBooks();
  showUser(token, false);
  initializeSearch();
  if (token != undefined) {
    showUser(token, false);
    loadBooks();
  }
});

/***
 *    ██╗LLL██╗███████╗███████╗██████╗L██████╗L██╗███████╗██████╗L██╗LLLLLL█████╗L██╗LLL██╗
 *    ██║LLL██║██╔════╝██╔════╝██╔══██╗██╔══██╗██║██╔════╝██╔══██╗██║LLLLL██╔══██╗╚██╗L██╔╝
 *    ██║LLL██║███████╗█████╗LL██████╔╝██║LL██║██║███████╗██████╔╝██║LLLLL███████║L╚████╔╝L
 *    ██║LLL██║╚════██║██╔══╝LL██╔══██╗██║LL██║██║╚════██║██╔═══╝L██║LLLLL██╔══██║LL╚██╔╝LL
 *    ╚██████╔╝███████║███████╗██║LL██║██████╔╝██║███████║██║LLLLL███████╗██║LL██║LLL██║LLL
 *    L╚═════╝L╚══════╝╚══════╝╚═╝LL╚═╝╚═════╝L╚═╝╚══════╝╚═╝LLLLL╚══════╝╚═╝LL╚═╝LLL╚═╝LLL
 *    LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
 */

function showUser(token, displayUser = true) {
  var xhr = new XMLHttpRequest();
  var apiEndpoint = "/api/userProfile/";

  xhr.responseType = "json";
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status == 200) {
        user = xhr.response;
        if (displayUser) {
          var render = false;
          var waitForRender = setInterval(() => {
            if (user != undefined) {
              renderUser(user);
              render = true;
              clearInterval(waitForRender);
            }
          }, 100);
        }
      }
    }
  };

  xhr.open("GET", apiEndpoint);
  //xhr.setRequestHeader("Authorization", "Token " + token)
  xhr.send();
}

function renderUser(user) {
  let logoutString = `
        <div class="row">
        <div class="col s10 offset-s1">
            <div class="row">
                <p class="card-text">You are currently logged in as: ${
                  user["first_name"]
                } ${user["last_name"]}!</p>
                <a class="waves-effect waves-light btn-large" onclick="logout()">Logout</a>
            </div>
        </div>
        </div>
        <script>
            function logout(){
                var xhr = new XMLHttpRequest();
                var url = "/logout/"
            
                xhr.responseType = "json"
                xhr.onreadystatechange = () => {
                    if(xhr.readyState === XMLHttpRequest.DONE){
                        if(xhr.status == 200){
                            console.log("[DEBUG] The user has been logged out");
                        }
                    }
                }
                xhr.open("GET", url);
                xhr.send();

                window.location = "/login";
            }
        </script>
        `;
  $("#logoutContainer").append(logoutString);
  $("#logoutContainer").addClass("z-depth-2");
}

$("#myAccount").click(function() {
  showUser();
  loadBooks(true);

  $("#bookContainer").empty();
  $("#newBookContainer").empty();
  $("#searchBarContainer").empty();
  $("#addBookButton").removeClass("disabled");
  $("#myAccount").addClass("disabled");
});

/***
 *    ██████╗LL██████╗LL██████╗L██╗LL██╗███████╗███████╗L█████╗L██████╗LL██████╗██╗LL██╗
 *    ██╔══██╗██╔═══██╗██╔═══██╗██║L██╔╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██║LL██║
 *    ██████╔╝██║LLL██║██║LLL██║█████╔╝L███████╗█████╗LL███████║██████╔╝██║LLLLL███████║
 *    ██╔══██╗██║LLL██║██║LLL██║██╔═██╗L╚════██║██╔══╝LL██╔══██║██╔══██╗██║LLLLL██╔══██║
 *    ██████╔╝╚██████╔╝╚██████╔╝██║LL██╗███████║███████╗██║LL██║██║LL██║╚██████╗██║LL██║
 *    ╚═════╝LL╚═════╝LL╚═════╝L╚═╝LL╚═╝╚══════╝╚══════╝╚═╝LL╚═╝╚═╝LL╚═╝L╚═════╝╚═╝LL╚═╝
 *    LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
 */

function initializeSearch() {
  let searchBooksString = `
    <div class="input-field" style="margin: 3rem;">
        <input type="text" id="search" placeholder="Search for a book, by title, author, isbn, topic or category">
    </div>
    `;

  $("#searchBarContainer").append(searchBooksString);
  $("#searchBarContainer").addClass("z-depth-1");

  $("#search").on("input", function() {
    searchBooks($("#search").val());
  });
}

function searchBooks(query) {
  var xhr = new XMLHttpRequest();
  var url = "/api/search/" + query;

  xhr.responseType = "json";
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status == 200) {
        loadBooksBool = false;
        $("bookContainer").empty();
        displayBooks(getBookList(xhr.response));
      }
    }
  };

  xhr.open("GET", url);
  xhr.setRequestHeader("Authorization", "Token " + token);
  xhr.send();
}

/***
 *    ██████╗LL██████╗LL██████╗L██╗LL██╗██████╗L██╗███████╗██████╗L██╗LLLLLL█████╗L██╗LLL██╗
 *    ██╔══██╗██╔═══██╗██╔═══██╗██║L██╔╝██╔══██╗██║██╔════╝██╔══██╗██║LLLLL██╔══██╗╚██╗L██╔╝
 *    ██████╔╝██║LLL██║██║LLL██║█████╔╝L██║LL██║██║███████╗██████╔╝██║LLLLL███████║L╚████╔╝L
 *    ██╔══██╗██║LLL██║██║LLL██║██╔═██╗L██║LL██║██║╚════██║██╔═══╝L██║LLLLL██╔══██║LL╚██╔╝LL
 *    ██████╔╝╚██████╔╝╚██████╔╝██║LL██╗██████╔╝██║███████║██║LLLLL███████╗██║LL██║LLL██║LLL
 *    ╚═════╝LL╚═════╝LL╚═════╝L╚═╝LL╚═╝╚═════╝L╚═╝╚══════╝╚═╝LLLLL╚══════╝╚═╝LL╚═╝LLL╚═╝LLL
 *    LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
 */

function getBookList(response) {
  var res = [];
  var currBook;
  for (var i = 0; i < response.length; i++) {
    var bookDict = {};
    currBook = response[i];
    bookDict["id"] = currBook["id"];
    bookDict["title"] = `${currBook["title1"]} ${
      currBook["title2"] ? "(" + currBook["title2"] + ")" : ""
    }`;
    bookDict["isbn"] = currBook["isbn"];
    bookDict["author"] = currBook["author"];
    bookDict["cover"] = currBook["cover"];
    bookDict["category"] = currBook["designation"];
    bookDict["topic"] = currBook["subject"];
    res.push(bookDict);
  }
  return res;
}

function loadBooks(rental = false) {
  var xhr = new XMLHttpRequest();
  var apiEndpoint = "/api/book/";

  xhr.responseType = "json";
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status == 200) {
        var bookList = getBookList(xhr.response);
        if (rental == true) {
          loadRentalList(bookList);
        } else {
          displayBooks(bookList);
        }
      }
      if (xhr.status == 403) {
        window.location.href = "/login";
      }
    }
  };

  xhr.open("GET", apiEndpoint);
  //xhr.setRequestHeader("Authorization", "Token " + token)
  xhr.setRequestHeader("X-CSRFToken", token);
  xhr.send();
}

function displayBooks(fetchedBooks, rental = false) {
  $("#bookContainer").empty();

  if (rental === true) {
    $("#bookContainer").append("<h5>Books that you reserved</h5>");
  }

  var row = 0;
  var count = 0;
  while (count < fetchedBooks.length) {
    const screensize = $("#bookContainer").width();
    var booksPerRow = 3;
    if (screensize >= 1000) {
      booksPerRow = 6;
    }

    //Decide wether to make a new row
    if (count % booksPerRow == 0) {
      row = Math.floor(count / booksPerRow);
      $("#bookContainer").append(
        '<div class="row" id="bookRow' + row + '"></div>'
      );
    }

    let bookString = makeBookCard(fetchedBooks[count], rental);
    if (count == fetchedBooks.length - 1 && rental == false) {
      bookString += `
            <script>
                function rentBook(id){
                    if(!$("#dateTo" + id).val() && $("#dateFrom" + id).val()){
                        M.toast({html: '<p class="card-text">Please specify a duration</p>'})
                        return
                    }

                    const rentalData = {
                        "book_copy": null,
                        "duration": null,
                    }
                    fetch("/api/book/" + id + "/copies", { method: "GET", headers: { "X-CSRFToken": token, "Content-Type": "application/json" } }).then((res) => {
                        res.json().then((json) => {
                            let c = 0;
                            while(c < json.length && !rentalData["book_copy"]){
                                if(json[c].available){
                                    rentalData["book_copy"] = json[c].id
                                }
                                if (c == json.length -1 && !rentalData["book_copy"]){
                                    M.toast({html: '<p class="card-text">Book is not available right now</p>'})
                                    return
                                } 
                                c += 1;
                            }
                            const duration = $("#duration" + id).val();
                            rentalData["duration"] = duration;
                            if (rentalData["duration"] > 10){
                                M.toast({html: '<p class="card-text">The maximum duration is 10 days</p>'})
                                return;
                            };

                            var xhr = new XMLHttpRequest();
                            var url = "/api/loan/reserved/";
                        
                            xhr.responseType = "json";
                            xhr.onreadystatechange = () => {
                                if (xhr.readyState === XMLHttpRequest.DONE){
                                    if (xhr.status == 201){
                                        M.toast({html: '<p class="card-text">new rental registered!</p>'})
                                        console.log('new rental registered!')
                                    } else if (xhr.status !== 200){
                                        M.toast({html: '<p class="card-text">Something went wrong while registering your loan!</p>'})
                                    }
                                };
                            };
                        
                            xhr.open("POST", url);
                            xhr.setRequestHeader("X-CSRFToken", token);
                            xhr.setRequestHeader("Content-Type", "application/json");
                            xhr.send(JSON.stringify(rentalData));
                        });
                    });
                }
                function expandCard(bookId, bookTitle, bookIsbn, bookTopic, bookCategory, duration, book_copy, booked, rental){
                    if ($("#" + bookId).text() != ""){
                        $("#" + bookId).empty()
                    } else {
                        const extendedCardString = 
                        '<div class="card-content">' +
                            '<p class="card-text"><b>' + bookTitle + '</b></p>' +
                            '<p class="card-text">' + bookIsbn + '</p>' +
                            '<p class="card-text">' + bookTopic + '</p>' +
                            '<p class="card-text">' + bookCategory + '</p>' +
                        '</div>' +
                        '<div class="card-action">' +
                            '<p class="card-text">Duration (in days): <input type="number" value="5" min="1" max="10" id="duration' + bookId + '"/></p>' +
                            '<a class="waves-effect waves-light btn-small" onclick="rentBook(' + bookId + ')">Rent this book</a>' +
                        '</div>'
                        $("#" + bookId).append(extendedCardString)
                    } 
                    
                    return
                }
            </script>
            `;
    } else if (count == fetchedBooks.length - 1 && rental == true) {
      bookString += `
            <script>
                function endLoan(id){
                    var xhr = new XMLHttpRequest();
                    var url = "/api/loan/reserved/" + id;
                
                    xhr.responseType = "json";
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE){
                            if (xhr.status == 200 || xhr.status == 204){
                                M.toast({html: 'You successfully ended your loan!'})
                            } else {
                                M.toast({html: 'There was a problem ending your loan!'})
                            }
                        };
                    };
                
                    xhr.open("DELETE", url);
                    xhr.setRequestHeader("X-CSRFToken", token);
                    xhr.send();
                }
                function expandCard(bookId, bookTitle, bookIsbn, bookTopic, bookCategory, duration, book_copy, booked, rental){
                    if ($("#" + bookId).text() != ""){
                        $("#" + bookId).empty()
                    } else {
                        if (rental){
                            const extendedCardString =
                            '<div class="card-content">' + 
                                '<b>' + bookTitle + '</b>' +
                            '</div>' +
                            '<div class="card-action">' +
                            '<p>Days left: ' +
                                '<b>' + duration + '</b>' +
                            '</p>' +
                            '<a class="waves-effect waves-light btn-small" onclick="endLoan(' + booked + ')">End Rental</a>' +
                            '</div>'
                            $("#" + bookId).append(extendedCardString)
                        }
                    }
                    
                    return
                }
            </script>
            `;
    }
    $("#bookRow" + row).append(bookString);
    count += 1;
  }
}

function renderBookCovers(bookId) {
  var xhr = new XMLHttpRequest();
  var url = "/api/book/cover/" + bookId;

  xhr.responseType = "jpeg";
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status == 200) {
        $("#" + bookId).attr("src", xhr.response);
      }
    }
  };

  xhr.open("GET", url);
  xhr.setRequestHeader("X-CSRFToken", token);
  xhr.send();
}

function makeBookCard(book, rental = false) {
  var bookCardString =
    `
    <div class="container col s4 m4 l4 xl2">
        <div class="card">` +
    (rental
      ? `<div class="card-image" onClick="expandCard(${
          book.id
        }, '${book.title.replace("'", "")}', '${book.isbn}', '${
          book.topic
        }', '${book.category}', '${book.duration}', '${book.book_copy}', ${
          book.loan_id
        }, ${rental})">`
      : `<div class="card-image" onClick="expandCard(${
          book.id
        }, '${book.title.replace("'", "")}', '${book.isbn}', '${
          book.topic
        }', '${
          book.category
        }', undefined, undefined, undefined, ${rental})">`) +
    `<img src="${book.cover}">
            <span class="card-title"></span>
            </div>
            <div id="${book.id}"></div>
        </div>
    </div>
    `;

  return bookCardString;
}

/***
 *    ██████╗L███████╗███╗LLL██╗████████╗L█████╗L██╗LLLLL██████╗L██╗███████╗██████╗L██╗LLLLLL█████╗L██╗LLL██╗
 *    ██╔══██╗██╔════╝████╗LL██║╚══██╔══╝██╔══██╗██║LLLLL██╔══██╗██║██╔════╝██╔══██╗██║LLLLL██╔══██╗╚██╗L██╔╝
 *    ██████╔╝█████╗LL██╔██╗L██║LLL██║LLL███████║██║LLLLL██║LL██║██║███████╗██████╔╝██║LLLLL███████║L╚████╔╝L
 *    ██╔══██╗██╔══╝LL██║╚██╗██║LLL██║LLL██╔══██║██║LLLLL██║LL██║██║╚════██║██╔═══╝L██║LLLLL██╔══██║LL╚██╔╝LL
 *    ██║LL██║███████╗██║L╚████║LLL██║LLL██║LL██║███████╗██████╔╝██║███████║██║LLLLL███████╗██║LL██║LLL██║LLL
 *    ╚═╝LL╚═╝╚══════╝╚═╝LL╚═══╝LLL╚═╝LLL╚═╝LL╚═╝╚══════╝╚═════╝L╚═╝╚══════╝╚═╝LLLLL╚══════╝╚═╝LL╚═╝LLL╚═╝LLL
 *    LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
 */

function loadRentalList(bookList) {
  var url = "/api/loan/reserved";
  fetch(url, { method: "GET" }).then(res => {
    res.json().then(json => {
      displayBooks(makeRentalList(bookList, json), true);
      url = url.replace("reserved", "active");
      fetch(url, { method: "GET" }).then(res => {
        res.json().then(json => {
          if (json.length > 0) {
            $("#bookContainer").append("<h5>Active Loans</h5>");
            appendActiveRentals(makeRentalList(bookList, json));
          }
        });
      });
    });
  });
}

function appendActiveRentals(rentals) {
  var row = 0;
  var count = 0;
  while (count < rentals.length) {
    const screensize = $("#bookContainer").width();
    var booksPerRow = 3;
    if (screensize >= 1000) {
      booksPerRow = 6;
    }

    //Decide wether to make a new row
    if (count % booksPerRow == 0) {
      row = Math.floor(count / booksPerRow);
      $("#bookContainer").append(
        '<div class="row" id="bookRow' + row + '"></div>'
      );
    }

    let bookString = makeBookCard(rentals[count], rental);
    if (count == rentals.length - 1) {
      bookString += `
      <script>
          function endLoan(id){
              var xhr = new XMLHttpRequest();
              var url = "/api/loan/active/" + id;
          
              xhr.responseType = "json";
              xhr.onreadystatechange = () => {
                  if (xhr.readyState === XMLHttpRequest.DONE){
                      if (xhr.status == 200 || xhr.status == 204){
                          M.toast({html: 'You successfully ended your loan!'})
                      } else {
                          M.toast({html: 'There was a problem ending your loan!'})
                      }
                  };
              };
          
              xhr.open("DELETE", url);
              xhr.setRequestHeader("X-CSRFToken", token);
              xhr.send();
          }
          function expandCard(bookId, bookTitle, bookIsbn, bookTopic, bookCategory, duration, book_copy, booked, rental){
              if ($("#" + bookId).text() != ""){
                  $("#" + bookId).empty()
              } else {
                  if (rental){
                      const extendedCardString =
                      '<div class="card-content">' + 
                          '<b>' + bookTitle + '</b>' +
                      '</div>' +
                      '<div class="card-action">' +
                      '<p>Days left: ' +
                          '<b>' + duration + '</b>' +
                      '</p>' +
                      '<a class="waves-effect waves-light btn-small" onclick="endLoan(' + booked + ')">End Loan</a>' +
                      '</div>'
                      $("#" + bookId).append(extendedCardString)
                  }
              }
              
              return
          }
      </script>
      `;
      $("#bookRow" + row).append(bookString);
      count += 1;
    }
  }
}

function makeRentalList(books, loans) {
  var res = [];
  for (var i = 0; i < loans.length; i++) {
    for (var j = 0; j < books.length; j++) {
      if (books[j]["id"] == loans[i]["id"]) {
        books[j]["loan_id"] = loans[i]["id"];
        books[j]["book_copy"] = loans[i]["book_copy"];
        books[j]["duration"] = loans[i]["duration"];
        res.push(books[j]);
        continue;
      }
    }
  }
  return res;
}

/***
 *    ██████╗L██╗LLL██╗███╗LLL██╗L█████╗L███╗LLL███╗██╗L██████╗██████╗LLLLLLL████████╗L██████╗██╗LL██╗
 *    ██╔══██╗╚██╗L██╔╝████╗LL██║██╔══██╗████╗L████║██║██╔════╝██╔══██╗▄L██╗▄╚══██╔══╝██╔════╝██║LL██║
 *    ██║LL██║L╚████╔╝L██╔██╗L██║███████║██╔████╔██║██║██║LLLLL██████╔╝L████╗LLL██║LLL██║LLLLL███████║
 *    ██║LL██║LL╚██╔╝LL██║╚██╗██║██╔══██║██║╚██╔╝██║██║██║LLLLL██╔══██╗▀╚██╔▀LLL██║LLL██║LLLLL██╔══██║
 *    ██████╔╝LLL██║LLL██║L╚████║██║LL██║██║L╚═╝L██║██║╚██████╗██████╔╝LL╚═╝LLLL██║LLL╚██████╗██║LL██║
 *    ╚═════╝LLLL╚═╝LLL╚═╝LL╚═══╝╚═╝LL╚═╝╚═╝LLLLL╚═╝╚═╝L╚═════╝╚═════╝LLLLLLLLLL╚═╝LLLL╚═════╝╚═╝LL╚═╝
 *    LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
 */

$("#feedButton").click(function() {
  wipePage();
  loadBooks();
  initializeSearch();
  $("#myAccount").removeClass("disabled");
});

function wipePage() {
  $("#bookContainer").empty();
  $("#newBookContainer").empty();
  $("#newBookContainer").removeClass("z-depth-4");
  $("#logoutContainer").empty();
  $("#logoutContainer").addClass("z-depth-4");
  $("#searchBarContainer").empty();
  $("#searchBarContainer").addClass("z-depth-1");
  $("#rentalContainer").empty();
  $("#rentalContainer").removeClass("z-depth-4");
}
