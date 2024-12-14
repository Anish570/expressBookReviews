const express = require("express");
const axios = require("axios"); // Axios for HTTP requests
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register user
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

public_users.get("/axios", (req, res) => {
  return res.status(200).json({ books });
});

// ---------------- Task 10: Get all books using Async/Await ----------------
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/axios");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books list" });
  }
});

// ---------------- Task 11: Get book details by ISBN ----------------
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject("No book found for this ISBN");
  })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// ---------------- Task 12: Get books by Author ----------------
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();
  new Promise((resolve, reject) => {
    const booksByAuthor = Object.keys(books)
      .filter((key) => books[key].author.toLowerCase() === author)
      .map((key) => {
        const { author, ...bookWithoutAuthor } = books[key];
        return bookWithoutAuthor;
      });

    if (booksByAuthor.length > 0) {
      return resolve(booksByAuthor);
    } else reject("No books found for this author");
  })
    .then((booksByAuthor) => {
      return res.status(200).json({ booksByAuthor });
    })
    .catch((err) => res.status(400).json({ err: err }));
});

// ---------------- Task 13: Get books by Title ----------------
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();

  new Promise((resolve, reject) => {
    const booksByTitle = Object.keys(books)
      .filter((key) => books[key].title.toLowerCase() === title)
      .map((key) => {
        const { title, ...bookWithoutTitle } = books[key];
        return bookWithoutTitle;
      });

    if (booksByTitle.length > 0) resolve(booksByTitle);
    else reject("No books found for this title");
  })
    .then((booksByTitle) => res.status(200).json({ booksByTitle }))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    const reviews = book.reviews;
    if (reviews) {
      return res.status(200).json(reviews);
    }
  }
  return res.status(400).json({ message: "book not found with this isbn" });
});

module.exports.general = public_users;
