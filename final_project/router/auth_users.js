const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'fingerprint_customer', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    
    // 1. Extract the review from the request QUERY parameter (e.g., ?review=Excellent)
    const reviewText = req.query.review;

    // 2. Retrieve the logged-in username from the session
    // Using optional chaining (?.) prevents crashes if the session isn't set up yet
    const username = req.session?.authorization?.username;

    // Safety Check: Ensure the user is actually logged in
    if (!username) {
        return res.status(403).json({ message: "User not authenticated. Please log in first." });
    }

    // Safety Check: Ensure they provided a review string in the query
    if (!reviewText) {
        return res.status(400).json({ message: "Please provide a review using the query format: ?review=your_text" });
    }

    // Safety Check: Ensure the book exists in your library database
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} does not exist.` });
    }

    // 3. Add or modify the review.
    // If books[isbn].reviews[username] already exists, this overwrites (modifies) it.
    // If it doesn't exist, it creates a new entry for this specific user.
    books[isbn].reviews[username] = reviewText;

    // 4. Return success along with the updated reviews object for transparency
    return res.status(200).json({
        message: `The review for book with ISBN ${isbn} has been added/updated.`,
        reviews: books[isbn].reviews
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // 1. Retrieve the logged-in username from the session
    const username = req.session?.authorization?.username;

    // Safety Check: Ensure the user is actually logged in
    if (!username) {
        return res.status(403).json({ message: "User not authenticated. Please log in first." });
    }

    // Safety Check: Ensure the book exists in the library database
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} does not exist.` });
    }

    // 2. Check if this specific user has even posted a review for this book
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        
        // 3. Delete only this user's review using the delete keyword
        delete books[isbn].reviews[username];

        return res.status(200).json({
            message: `Review for ISBN ${isbn} posted by user ${username} has been successfully deleted.`,
            reviews: books[isbn].reviews // Returns the remaining reviews
        });
    } else {
        // Return error if they try to delete a review they never wrote
        return res.status(404).json({ message: `No review found for ISBN ${isbn} by user ${username}.` });
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
