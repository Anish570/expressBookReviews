const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const user = users.filter((user) => user.username === username);
  if (!user.length > 0) {
    users.push({
      username,
      password,
    });
    return res.status(201).json({ message: "user registered successfully" });
  }
  return res.status(400).json({ message: "Username already exists" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json({ [isbn]: book });
  }
  return res.status(404).json({ message: "No book found for this ISBN" });
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author.toLowerCase();
  if (!author) return res.status(400).json({ message: "Author is required" });
  const booksByAuthor = Object.keys(books)
    .filter((key) => books[key].author.toLowerCase() === author)
    .map((key) => books[key]);
  if (booksByAuthor.length > 0) {
    return res.status(300).json({
      [Object.keys(booksByAuthor)]: booksByAuthor,
    });
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  if (!title) return res.status(400).json({ message: "Title is required" });
  const booksByTitle = Object.keys(books)
    .filter((key) => books[key].title.toLowerCase() === title)
    .map((key) => books[key]);
  if (booksByTitle.length > 0) {
    return res.status(200).json({
      [Object.keys(booksByTitle)]: booksByTitle,
    });
  } else {
    return res.status(404).json({ message: "No books found for this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    const reviews = book.reviews;
    if (Object.keys(reviews).length > 0) {
      return res.status(200).json(reviews);
    }
    return res.status(404).json({ message: "No reviews found for this book" });
  }
  return res.status(400).json({ message: "book not found with this isbn" });
});

module.exports.general = public_users;
