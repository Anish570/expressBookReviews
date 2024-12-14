const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const isUser = users.filter((user) => user.username === username);
  return isUser.length > 0;
};

const authenticatedUser = (username, password) => {
  let availableUser = users.filter(
    (user) => user.username === username && user.password === password
  );
  return availableUser.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    if (authenticatedUser(username, password)) {
      const token = jwt.sign({ password }, "secret", { expiresIn: "1h" });
      req.session.authorization = { user: username, accessToken: token };
      return res.status(200).json({
        message: "Customer Logged in successfully",
      });
    } else {
      return res.status(300).json({ message: "Invalid credentials" });
    }
  } else {
    return res.status(300).json({ message: "Customer not found" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body;

  const user = req.session.authorization["user"];

  if (books[isbn]) {
    const book = books[isbn];
    book.reviews[user] = review;
    return res.status(201).json({
      message: `Review for isbn ${isbn} by ${user} has been added/updated successfully`,
    });
  }
  return res.status(400).json({ message: "book not found" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization["user"];
  if (books[isbn]) {
    const book = books[isbn];
    if (book.reviews[user]) {
      delete book.reviews[user];
      return res.status(200).json({
        message: `Review for the isbn ${isbn} by ${user} has been deleted`,
      });
    } else {
      return res.status(400).json({ message: "Review not found" });
    }
  }
  return res.status(400).json({ message: "book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
