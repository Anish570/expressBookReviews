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
      req.session.authorization = { accessToken: token };
      return res
        .status(200)
        .json({
          message: "Customer Logged in successfully",
          accessToken: token,
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
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
