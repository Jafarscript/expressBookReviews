const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn
    return res.send(books[isbn])
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author.toLowerCase()

    let results = {}
    let bookKeys = Object.keys(books);

    for (let i = 0; i < bookKeys.length; i++) {
        const key = bookKeys[i];
        const book = books[key];

        if (book.author.toLowerCase() === author) {
            results[key] = book
        }
    };

    if (Object.keys(results).length === 0) {
        return res.status(404).json({ message: `No books found for author: ${req.params.authorName}` });
    }
    return res.send(results)
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
