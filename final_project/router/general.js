const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//     //Write your code here
//     return res.send(JSON.stringify(books, null, 4))
// });
public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => {
            return new Promise((resolve) => {
                resolve(books);
            });
        };
        
        let bookList = await getBooks();
        return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     //Write your code here
//     let isbn = req.params.isbn
//     return res.send(books[isbn])
// });
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    
    try {
        const getBookByIsbn = (isbnNum) => {
            return new Promise((resolve, reject) => {
                if (books[isbnNum]) {
                    resolve(books[isbnNum]);
                } else {
                    reject(new Error(`Book with ISBN ${isbnNum} not found`));
                }
            });
        };

        let bookDetails = await getBookByIsbn(isbn);
        return res.status(200).json(bookDetails);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     //Write your code here
//     const author = req.params.author.toLowerCase()

//     let results = {}
//     let bookKeys = Object.keys(books);

//     for (let i = 0; i < bookKeys.length; i++) {
//         const key = bookKeys[i];
//         const book = books[key];

//         if (book.author.toLowerCase() === author) {
//             results[key] = book
//         }
//     };

//     if (Object.keys(results).length === 0) {
//         return res.status(404).json({ message: `No books found for author: ${req.params.authorName}` });
//     }
//     return res.send(results)
// });
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();
    
    try {
        const getBooksByAuthor = (authorName) => {
            return new Promise((resolve, reject) => {
                let results = {};
                let bookKeys = Object.keys(books);

                for (let i = 0; i < bookKeys.length; i++) {
                    const key = bookKeys[i];
                    const book = books[key];
                    if (book.author.toLowerCase() === authorName) {
                        results[key] = book;
                    }
                }

                if (Object.keys(results).length > 0) {
                    resolve(results);
                } else {
                    reject(new Error(`No books found for author: ${req.params.author}`));
                }
            });
        };

        let matchingBooks = await getBooksByAuthor(author);
        return res.status(200).json(matchingBooks);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     //Write your code here
//     const title = req.params.title

//     let results = {}
//     let bookKeys = Object.keys(books);

//     for (let i = 0; i < bookKeys.length; i++) {
//         const key = bookKeys[i];
//         const book = books[key];

//         if (book.title.toLowerCase() === title.toLowerCase()) {
//             results[key] = book
//         }
//     };

//     if (Object.keys(results).length === 0) {
//         return res.status(404).json({ message: `No books found for title: ${req.params.title}` });
//     }
//     return res.send(results)
// });
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();

    try {
        const getBooksByTitle = (titleName) => {
            return new Promise((resolve, reject) => {
                let results = {};
                let bookKeys = Object.keys(books);

                for (let i = 0; i < bookKeys.length; i++) {
                    const key = bookKeys[i];
                    const book = books[key];
                    if (book.title.toLowerCase() === titleName) {
                        results[key] = book;
                    }
                }

                if (Object.keys(results).length > 0) {
                    resolve(results);
                } else {
                    reject(new Error(`No books found for title: ${req.params.title}`));
                }
            });
        };

        let matchingBooks = await getBooksByTitle(title);
        return res.status(200).json(matchingBooks);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn

    if (books[isbn]){
        let reviews = books[isbn].reviews; 
        return res.status(200).json(reviews);
    }else{
        return res.status(404).json({ message: `No reviews found. Book with ISBN ${isbn} does not exist.` });
    }
});

module.exports.general = public_users;
