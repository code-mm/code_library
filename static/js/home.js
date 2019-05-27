$('document').ready(function(){
    $('.sidenav').sidenav();
    loadBooks();
    showUser(token, false)
    initializeSearch();
    setInterval(() => {
        if(token != undefined && loadBooksBool == true){
            showUser(token, false)
            loadBooks();
        }
    }, 100000)
})

/***
 *    ██╗LLL██╗███████╗███████╗██████╗L██████╗L██╗███████╗██████╗L██╗LLLLLL█████╗L██╗LLL██╗
 *    ██║LLL██║██╔════╝██╔════╝██╔══██╗██╔══██╗██║██╔════╝██╔══██╗██║LLLLL██╔══██╗╚██╗L██╔╝
 *    ██║LLL██║███████╗█████╗LL██████╔╝██║LL██║██║███████╗██████╔╝██║LLLLL███████║L╚████╔╝L
 *    ██║LLL██║╚════██║██╔══╝LL██╔══██╗██║LL██║██║╚════██║██╔═══╝L██║LLLLL██╔══██║LL╚██╔╝LL
 *    ╚██████╔╝███████║███████╗██║LL██║██████╔╝██║███████║██║LLLLL███████╗██║LL██║LLL██║LLL
 *    L╚═════╝L╚══════╝╚══════╝╚═╝LL╚═╝╚═════╝L╚═╝╚══════╝╚═╝LLLLL╚══════╝╚═╝LL╚═╝LLL╚═╝LLL
 *    LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
 */

function showUser(token, displayUser=true){
    var xhr = new XMLHttpRequest();
    var apiEndpoint = "http://localhost:8000/api/userProfile/";

    xhr.responseType = "json";
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            if(xhr.status == 200){
                user = xhr.response;
                if(displayUser){
                    var render = false;
                    var waitForRender = setInterval(() => {
                        if(user != undefined){
                            renderUser(user);
                            render = true;
                            clearInterval(waitForRender);
                        }
                    }, 100)
                }
            }
        }
    };

    xhr.open("GET", apiEndpoint);
    //xhr.setRequestHeader("Authorization", "Token " + token)
    xhr.send();
}

function renderUser(user){
    let logoutString = `
        <div class="row">
        <div class="col s10 offset-s1">
            <div class="row">
                <p>You are currently logged in as: ${user["first_name"]} ${user["last_name"]}!</p>
                <a class="waves-effect waves-light btn-small" onclick="logout()">Logout</a>
            </div>
        </div>
        </div>
        <script>
            function logout(){
                var xhr = new XMLHttpRequest();
                var url = "http://localhost:8000/logout/"
            
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

                window.location = "http://localhost:8000/login";
            }
        </script>
        `
    $('#logoutContainer').append(logoutString);
    $('#logoutContainer').addClass('z-depth-4')
}

$('#myAccount').click(function(){
    showUser()
    loadBooks(true)

    loadBooksBool = false;
    $('#bookContainer').empty();
    $('#newBookContainer').empty();
    $('#searchBarContainer').empty();
    $('#addBookButton').removeClass('disabled');
    $('#myAccount').addClass('disabled');
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

function initializeSearch(){
    let searchBooksString = `
    <div class="input-field" style="margin: 3rem;">
        <input type="text" id="search" placeholder="Search for your favourite book! (By entering title, author, isbn, topic or category)">
    </div>
    `

    $('#searchBarContainer').append(searchBooksString)
    $('#searchBarContainer').addClass('z-depth-1')

    $('#search').on('input', function(){
        searchBooks($('#search').val())
    });
}

function searchBooks(query){
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:8000/api/search/" + query;

    xhr.responseType = "json";
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE){
            if(xhr.status == 200){
                loadBooksBool = false;
                $('bookContainer').empty();
                displayBooks(xhr.response);
            }
        };
    };

    xhr.open("GET", url);
    xhr.setRequestHeader("Authorization", "Token " + token)
    xhr.send();
}

/***
 *    ██████╗LL██████╗LL██████╗L██╗LL██╗L██████╗██████╗L███████╗L█████╗L████████╗██╗L██████╗L███╗LLL██╗
 *    ██╔══██╗██╔═══██╗██╔═══██╗██║L██╔╝██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗LL██║
 *    ██████╔╝██║LLL██║██║LLL██║█████╔╝L██║LLLLL██████╔╝█████╗LL███████║LLL██║LLL██║██║LLL██║██╔██╗L██║
 *    ██╔══██╗██║LLL██║██║LLL██║██╔═██╗L██║LLLLL██╔══██╗██╔══╝LL██╔══██║LLL██║LLL██║██║LLL██║██║╚██╗██║
 *    ██████╔╝╚██████╔╝╚██████╔╝██║LL██╗╚██████╗██║LL██║███████╗██║LL██║LLL██║LLL██║╚██████╔╝██║L╚████║
 *    ╚═════╝LL╚═════╝LL╚═════╝L╚═╝LL╚═╝L╚═════╝╚═╝LL╚═╝╚══════╝╚═╝LL╚═╝LLL╚═╝LLL╚═╝L╚═════╝L╚═╝LL╚═══╝
 *    LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
 

$('#addBook').click(function(){
    if(login == true){
        loadBooksBool = false;
        wipePage();
        $('#addBookButton').addClass('disabled');
        $('#myAccount').removeClass('disabled');
        $('#newBookContainer').append(newBookFormString)
        $('#newBookContainer').addClass('z-depth-4')
    }
})

let newBookFormString = `
<div class="row">
    <h3>Create a new book entry:</h3>
</div>
<div class="divider"></div>
<div class="row">
    <form class="col s10 offset-s1">
        <div class="row">
            <div class="input-field col s6">
                <input type ="text" id="title">
                <label for="title">Title</label>
            </div>
            <div class="input-field col s6">
                <input type ="text" id="author">
                <label for="author">Author</label>
            </div>
        </div>
        <div class="row">
            <div class="input-field col s6">
                <input type ="text" id="isbn">
                <label for="isbn">ISBN</label>
            </div>
            <div class="input-field col s6">
                <input type ="text" id="cover">
                <label for="cover">Cover</label>
            </div>
        </div>
        <div class="row">
            <div class="input-field col s6">
                <input type ="number" step="0.1" id="price">
                <label for="price">Price per day</label>
            </div>
            <div class="input-field col s6">
                <a class="waves-effect waves-light btn" id="createBook">Create a new Entry</a>
            </div>
            <script>
                $('#createBook').click(function(){
                    const bookData = {
                        isbn: $("#isbn").val(),
                        title: $("#title").val(),
                        author: $("#author").val(),
                        cover: $("#cover").val(),
                        price: $("#price").val(),
                        owner: user.user,
                    }
                
                    var xhr = new XMLHttpRequest();
                    var url = "http://localhost:8000/api/book/create/";
                
                    xhr.responseType = "json";
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE){
                            M.toast({html: 'Book has been created!'})
                        };
                    };
                
                    xhr.open("POST", url);
                    xhr.setRequestHeader("Authorization", "Token " + token)
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.send(JSON.stringify(bookData));
                })
            </script>
        </div>
    </form>
</div>
`
*/

/** create/
Allowed method: POST
Required attributes: isbn, title, author, cover, price, owner*/

/***
 *    ██████╗LL██████╗LL██████╗L██╗LL██╗██████╗L██╗███████╗██████╗L██╗LLLLLL█████╗L██╗LLL██╗
 *    ██╔══██╗██╔═══██╗██╔═══██╗██║L██╔╝██╔══██╗██║██╔════╝██╔══██╗██║LLLLL██╔══██╗╚██╗L██╔╝
 *    ██████╔╝██║LLL██║██║LLL██║█████╔╝L██║LL██║██║███████╗██████╔╝██║LLLLL███████║L╚████╔╝L
 *    ██╔══██╗██║LLL██║██║LLL██║██╔═██╗L██║LL██║██║╚════██║██╔═══╝L██║LLLLL██╔══██║LL╚██╔╝LL
 *    ██████╔╝╚██████╔╝╚██████╔╝██║LL██╗██████╔╝██║███████║██║LLLLL███████╗██║LL██║LLL██║LLL
 *    ╚═════╝LL╚═════╝LL╚═════╝L╚═╝LL╚═╝╚═════╝L╚═╝╚══════╝╚═╝LLLLL╚══════╝╚═╝LL╚═╝LLL╚═╝LLL
 *    LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
 */

function getBookList(response){
    var res = [];
    var currBook;
    for(var i = 0; i < response.length; i++){
        var bookDict = {};
        currBook = response[i];
        bookDict["id"] = currBook["id"];
        bookDict["title"] = currBook["title"];
        bookDict["isbn"] = currBook["isbn"];;
        bookDict["author"] = currBook["author"];
        bookDict["cover"] = currBook["cover"];
        bookDict["category"] = currBook["category"];
        bookDict["topic"] = currBook["topic"];
        res.push(bookDict);
    }
    return res;
}

function loadBooks(rental=false){
    var xhr = new XMLHttpRequest();
    var apiEndpoint = "http://localhost:8000/api/book/";

    xhr.responseType = "json";
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            if(xhr.status == 200){
                var bookList = getBookList(xhr.response);
                if(rental == true){
                    loadRentalList(bookList);
                } else {
                    displayBooks(bookList);
                }
            }
            if(xhr.status == 403){
                window.location.href = "http://localhost:8000/login";
            }
        }
    };

    xhr.open("GET", apiEndpoint);
    //xhr.setRequestHeader("Authorization", "Token " + token)
    xhr.setRequestHeader("X-CSRFToken", token)
    xhr.send();
}

function displayBooks(fetchedBooks, rental=false){
    $('#bookContainer').empty()

    var row = 0;
    var count = 0
    while(count<fetchedBooks.length){
        //Decide wether to make a new row
        if((count) % 4 == 0){
            row = Math.floor((count) / 4);
            $('#bookContainer').append('<div class="row" id="bookRow' + row + '"></div>');
        }

        /*let author = fetchedBooks[i].author;
        let isbn = fetchedBooks[i].isbn;
        let cover = fetchedBooks[i].cover;
        let price = fetchedBooks[i].price;*/
        let bookString = makeBookCard(fetchedBooks[count], rental);
        if(count == fetchedBooks.length - 1 && rental == false){
            bookString += `
            <script>
                function rentBook(id){
                    const rentalData = {
                        "book": id,
                        "user": user.id,
                        "from_date": $("#dateFrom" + id).val(),
                        "to_date": $("#dateTo" + id).val(),
                    }
                
                    var xhr = new XMLHttpRequest();
                    var url = "http://localhost:8000/api/loan/";
                
                    xhr.responseType = "json";
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE){
                            if (xhr.status == 201){
                                M.toast({html: 'new rental registered'})
                                console.log('new rental registered!')
                            }
                        };
                    };
                
                    xhr.open("POST", url);
                    xhr.setRequestHeader("X-CSRFToken", token);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.send(JSON.stringify(rentalData));
                }
                function expandCard(bookId, bookTitle, bookIsbn, bookTopic, bookCategory, bookedFrom, bookedTo, booked, rental){
                    if ($("#" + bookId).text() != ""){
                        $("#" + bookId).empty()
                    } else {
                        if (rental){
                            const extendedCardString =
                            '<div class="card-content">' + 
                                '<b>' + bookTitle + '</b>' +
                            '</div>' +
                            '<div class="card-action">' +
                            '<p>Rented from: ' +
                                '<b>' + bookedFrom + '</b>' +
                            '</p>' +
                            '<p>Rented to:' + bookedTo + '</p>' +
                            '<a class="waves-effect waves-light btn-small" onclick="endLoan(' + booked + ')">End Loan</a>' +
                            '</div>'
                            $("#" + bookId).append(extendedCardString)
                        }
                        if (!rental){
                            const extendedCardString = 
                            '<div class="card-content">' +
                                '<b>' + bookTitle + '</b>' +
                                '<p>' + bookIsbn + '</p>' +
                                '<p>' + bookTopic + '</p>' +
                                '<p>' + bookCategory + '</p>' +
                            '</div>' +
                            '<div class="card-action">' +
                                '<p>From: <input type="date" min="2018-10-31" id="dateFrom' + bookId + '"</p>' +
                                '<p>To: <input type="date" min="2018-10-31" id="dateTo' + bookId + '"</p>' +
                                '<a class="waves-effect waves-light btn-small" onclick="rentBook(' + bookId + ')">Rent this book</a>' +
                            '</div>'
                            $("#" + bookId).append(extendedCardString)
                        }
                    } 
                    
                    return
                }
            </script>
            `
        } else if(count == fetchedBooks.length - 1 && rental == true){
            bookString += `
            <script>
                function endLoan(id){
                    var xhr = new XMLHttpRequest();
                    var url = "http://localhost:8000/api/loan/" + id;
                
                    xhr.responseType = "json";
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE){
                            if (xhr.status == 200){
                                M.toast({html: 'loan ended!'})
                            }
                        };
                    };
                
                    xhr.open("DELETE", url);
                    xhr.setRequestHeader("X-CSRFToken", token);
                    xhr.send();
                }
                function expandCard(bookId, bookTitle, bookIsbn, bookTopic, bookCategory, bookedFrom, bookedTo, booked, rental){
                    if ($("#" + bookId).text() != ""){
                        $("#" + bookId).empty()
                    } else {
                        if (rental){
                            const extendedCardString =
                            '<div class="card-content">' + 
                                '<b>' + bookTitle + '</b>' +
                            '</div>' +
                            '<div class="card-action">' +
                            '<p>Rented from: ' +
                                '<b>' + bookedFrom + '</b>' +
                            '</p>' +
                            '<p>Rented to: ' + bookedTo + '</p>' +
                            '<a class="waves-effect waves-light btn-small" onclick="endLoan(' + booked + ')">End Loan</a>' +
                            '</div>'
                            $("#" + bookId).append(extendedCardString)
                        }
                        if (!rental){
                            const extendedCardString = 
                            '<div class="card-content">' +
                                '<b>' + bookTitle + '</b>' +
                                '<b>' + bookTitle + '</b>' +
                                '<p>' + bookIsbn + '</p>' +
                                '<p>' + bookTopic + '</p>' +
                                '<p>' + bookCategory + '</p>' +
                            '</div>' +
                            '<div class="card-action">' +
                                '<p>From: <input type="date" min="2018-10-31" id="dateFrom$' + bookId + '"</p>' +
                                '<p>To: <input type="date" min="2018-10-31" id="dateTo' + bookId + '"</p>' +
                                '<a class="waves-effect waves-light btn-small" onclick="rentBook(' + bookId + ')">Rent this book</a>' +
                            '</div>'
                            $("#" + bookId).append(extendedCardString)
                        } 
                    }
                    
                    return
                }
            </script>
            `
        }
        $('#bookRow' + row).append(bookString);
        count += 1;
    };
}

function renderBookCovers(bookId){
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:8000/api/book/cover/" + bookId;

    xhr.responseType = "jpeg";
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            if(xhr.status == 200){
                $("#" + bookId).attr("src", xhr.response);
            }
        }
    };

    xhr.open("GET", url);
    xhr.setRequestHeader("X-CSRFToken", token)
    xhr.send();
}

function makeBookCard(book, rental=false){
    var bookCardString = `
    <div class="col s3 m3 l3">
        <div class="card">` +
            (rental ? `<div class="card-image" onClick="expandCard(${book.id}, '${book.title}', '${book.isbn}', '${book.topic}', '${book.category}', '${book.from_date}', '${book.to_date}', ${book.loan_id}, ${rental})">` : `<div class="card-image" onClick="expandCard(${book.id}, '${book.title}', '${book.isbn}', '${book.topic}', '${book.category}', undefined, undefined, undefined, ${rental})">`) +
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

function loadRentalList(bookList){
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:8000/api/loanOwn";

    xhr.responseType = "json";
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE){
            makeRentalList(bookList, xhr.response);
        };
    };

    xhr.open("GET", url);
    xhr.send();
}

function makeRentalList(fetchedRentals, loans){
    var res = [];
    for (var i = 0; i < loans.length; i++){
        for(var j = 0; j < fetchedRentals.length; j++){
            if (fetchedRentals[j]["id"] == loans[i]["book"]){
                fetchedRentals[j]["loan_id"] = loans[i]["id"]
                fetchedRentals[j]["from_date"] = loans[i]["from_date"]
                fetchedRentals[j]["to_date"] = loans[i]["to_date"]
                res.push(fetchedRentals[j]);
            }
        }
    }
    displayBooks(res, true);
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

$('#feedButton').click(function(){
    wipePage();
    loadBooks();
    initializeSearch();
    loadBooksBool = true;
    $('#myAccount').removeClass('disabled');
})

function wipePage(){
    $('#bookContainer').empty();
    $('#newBookContainer').empty();
    $('#newBookContainer').removeClass('z-depth-4')
    $('#logoutContainer').empty();
    $('#logoutContainer').addClass('z-depth-4')
    $('#searchBarContainer').empty();
    $('#searchBarContainer').addClass('z-depth-1')
    $('#rentalContainer').empty();
    $('#rentalContainer').removeClass('z-depth-4')
}