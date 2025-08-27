const jwt = require('jsonwebtoken');

let users = {};







function isValid(username) {
    let userswithsamename = users[username];
    return !userswithsamename;
};







function authenticatedUser(username, password) {
    let validusers = users[username];
    return validusers && validusers.password === password;
};







const getAllBooks = (req, res) => {
    res.send(JSON.stringify(books, null, 4));
};







const gedetailsISBN = (req, res) => {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
};







const getBooksByAuthor = (req, res) => {
    const author = req.params.author;
    let filtered_books = {};

    for (let key in books) {
        if (books[key].author === author) {
            filtered_books[key] = books[key];
        }
    }
    res.send(filtered_books);
};







const getBooksByTitle = (req, res) => {
    const title = req.params.title;
    let filtered_books = {};
    for (let key in books) {
        if (books[key].title === title) {
            filtered_books[key] = books[key];
        }
    }
    res.send(filtered_books);
};







const getBookReview = (req, res) => {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
};







const registerUser = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users[username] = {"password": password};
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
};







const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
};







const reviewadded = (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    
    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({message: "Review successfully added/updated"});
    } else {
        return res.status(404).json({message: "Book not found"});
    }
};







const deleteReview = (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    
    if (books[isbn] && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({message: "Review successfully deleted"});
    } else {
        return res.status(404).json({message: "Review not found"});
    }
};







const getAllBooksAsyncCallback = (req, res) => {
    getAllBooksAsync((err, result) => {
        if (err) {
            res.status(500).json({error: err.message});
        } else {
            res.json(result);
        }
    });
};







function getBookByISBNPromise(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error('Book not found'));
            }
        }, 1000);
    });
};







const searchByISBNPromise = (req, res) => {
    const isbn = req.params.isbn;
    getBookByISBNPromise(isbn)
        .then(book => {
            res.json(book);
        })
        .catch(err => {
            res.status(404).json({error: err.message});
        });
};







async function searchByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let filtered_books = {};

            for (let key in books) {
                if (books[key].author === author) {
                    filtered_books[key] = books[key];
                }
            }
            resolve(filtered_books);
        }, 1000);
    });
};





async function searchByTitle(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let filtered_books = {};

            for (let key in books) {
                if (books[key].title === title) {
                    filtered_books[key] = books[key];
                }
            }
            resolve(filtered_books);
        }, 1000);
    });
};


