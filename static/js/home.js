$("document").ready(function() {
  $(".sidenav").sidenav();
  showUser(token, false);
  initializeSearch();
  if (token != undefined) {
    showUser(token, false);
    loadBooks(false, 20);
  }
});

window.onscroll = function(ev) {
  if (!searched) {
    if (
      window.innerHeight + window.scrollY + 100 >=
      document.body.offsetHeight
    ) {
      loadBooks(false, 10);
    }
  }
};

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
                  user["username"]
                }!</p>
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
    const query = $("#search").val();
    if (query === "") {
      searched = undefined;
    } else {
      searched = true;
      searchBooks(query);
    }
  });
}

function searchBooks(query) {
  var xhr = new XMLHttpRequest();
  var url = "/api/search/" + query;

  xhr.responseType = "json";
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status == 200) {
        booksLoaded = 0;
        displayBooks(getBookList(xhr.response), false, 20);
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

function loadBooks(rental = false, amount = null) {
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
          displayBooks(bookList, false, amount);
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

function displayBooks(fetchedBooks, rental = false, amount) {
  if (booksLoaded === 0) {
    $("#bookContainer").empty();
  }

  if (rental === true) {
    $("#reservedContainer").append("<h5>Books that you reserved</h5>");
    $("#reservedContainer").css("display", "");
  }

  let displayCount;
  let count;
  if (amount) {
    displayCount = booksLoaded + amount;
    count = booksLoaded;
    booksLoaded += amount;
  } else {
    displayCount = fetchedBooks.length;
    row = 0;
    count = 0;
  }

  while (count < displayCount) {
    let screensize;
    if (rental === true) {
      screensize = $("#reservedContainer").width();
    } else {
      screensize = $("#bookContainer").width();
    }
    var booksPerRow = 3;
    if (screensize >= 1000) {
      booksPerRow = 6;
    }

    //Decide wether to make a new row
    if (count % booksPerRow == 0) {
      row = Math.floor(count / booksPerRow);
      if (rental === true) {
        $("#reservedContainer").append(
          '<div class="row" id="reservedRow' + row + '"></div>'
        );
      } else {
        $("#bookContainer").append(
          '<div class="row" id="bookRow' + row + '"></div>'
        );
      }
    }

    let bookString = makeBookCard(fetchedBooks[count], rental);
    if (count == displayCount - 1 && rental == false) {
      bookString += `
            <script>
                function rentBook(bookId, copy_id){
                  const duration = $("#duration" + bookId).val();
                  const rentalData = {
                      "book_copy": copy_id,
                      "duration": duration,
                  }
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
                }

                function expandCard(bookId, bookTitle, bookIsbn, bookTopic, bookCategory, duration, book_copy, booked, rental){
                  fetch("/api/book/" + bookId + "/copies/", { method: "GET", headers: { "X-CSRFToken": token, "Content-Type": "application/json" } }).then((res) => {
                    res.json().then((json) => {
                      let c = 0;
                      let copy_id;
                      while(c < json.length && !copy_id){
                          if(json[c].available && !copy_id){
                              copy_id = json[c].id
                              console.log(json[c]);
                          }
                          c += 1;
                      }

                      if ($("#" + bookId).text() != ""){
                          $("#" + bookId).empty()
                      } else {
                          $("#" + expandedCard).empty()
                          expandedCard = bookId;
                          let extendedCardString = 
                          '<div class="card-content">' +
                              '<p class="card-text"><b>' + bookTitle + '</b></p>' +
                              '<p class="card-text">' + bookIsbn + '</p>' +
                              '<p class="card-text">' + bookTopic + '</p>' +
                              '<p class="card-text">' + bookCategory + '</p>'
                          
                          if (copy_id !== undefined){
                            extendedCardString += '<p class="card-text" style="color: green">available</p>' + 
                            '</div>'
                            extendedCardString +=
                            '<div class="card-action">' +
                                '<p class="card-text">Duration (in days): <input type="number" value="5" min="1" max="10" id="duration' + bookId + '"/></p>' +
                                '<a class="waves-effect waves-light btn-small" onclick="rentBook(' + bookId + ', ' + copy_id  + ')">Rent this book</a>' +
                            '</div>'
                          } else {
                            extendedCardString += '<p class="card-text" style="color: red">not available right now</p>' + 
                            '</div>'
                            extendedCardString +=
                            '<div class="card-action">' +
                                '<p class="card-text">Duration (in days): <input type="number" value="5" min="1" max="10" id="duration' + bookId + '"/></p>' +
                                '<a class="waves-effect waves-light btn-small" onclick="rentBook(' + bookId + ', ' + copy_id  + ')">Reserve this book</a>' +
                            '</div>'
                          }
                          

                          $("#" + bookId).append(extendedCardString)
                      } 
                      return
                    });
                  });
                }
            </script>
            `;
    } else if (count == displayCount - 1 && rental == true) {
      bookString += `
            <script>
                function endLoan(id){
                    var xhr = new XMLHttpRequest();
                    var url = "/api/loan/reserved/" + id + "/";
                
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

    if (rental === true) {
      $("#reservedRow" + row).append(bookString);
    } else {
      $("#bookRow" + row).append(bookString);
    }
    count += 1;
  }
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
  var url = "/api/loan/reserved/";
  fetch(url, { method: "GET" }).then(res => {
    res.json().then(json => {
      displayBooks(makeRentalList(bookList, json), true);
      url = url.replace("reserved", "active");
      fetch(url, { method: "GET" }).then(res => {
        res.json().then(json => {
          if (json.length > 0) {
            $("#activeContainer").append("<h5>Active Loans</h5>");
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
    const screensize = $("#activeContainer").width();
    var booksPerRow = 3;
    if (screensize >= 1000) {
      booksPerRow = 6;
    }

    //Decide wether to make a new row
    if (count % booksPerRow == 0) {
      row = Math.floor(count / booksPerRow);
      $("#activeContainer").append(
        '<div class="row" id="activeRow' + row + '"></div>'
      );
    }

    let bookString = makeBookCard(rentals[count], rental);
    if (count == rentals.length - 1) {
      bookString += `
      <script>
          function endLoan(id){
              var xhr = new XMLHttpRequest();
              var url = "/api/loan/active/" + id + "/";
          
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
      $("#activeRow" + row).append(bookString);
      count += 1;
    }
  }
}

function makeRentalList(books, loans) {
  console.log(books);
  var res = [];
  for (var i = 0; i < loans.length; i++) {
    for (var j = 0; j < books.length; j++) {
      if (books[j]["id"] == loans[i]["book_id"]) {
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
  booksLoaded = 0;
  loadBooks(false, 20);
  initializeSearch();
  $("#myAccount").removeClass("disabled");
});

function wipePage() {
  $("#bookContainer").empty();
  $("#reservedContainer")
    .empty()
    .css("display", "none");
  $("#activeContainer")
    .empty()
    .css("display", "none");
  $("#newBookContainer").empty();
  $("#newBookContainer").removeClass("z-depth-4");
  $("#logoutContainer").empty();
  $("#logoutContainer").addClass("z-depth-4");
  $("#searchBarContainer").empty();
  $("#searchBarContainer").addClass("z-depth-1");
  $("#rentalContainer").empty();
  $("#rentalContainer").removeClass("z-depth-4");
}
