var express = require("express");
var router = express.Router();
const Book = require("../models").Book;

/* Getting home page. */
router.get("/", async(req, res, next) => {
  const allBooks = await Book.findAll();
  res.render("books", { allBooks });
});

/* Creating a form for a new book. */
router.get("/new", (req, res) => {
  res.render("books/new-book", { book: {}, title: "New Book" });
});

/* Posting a new book */
router.post("/new", async (req, res) => {
  let newBook;
  try {
    newBook = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // checking the error
      newBook = await Book.build(req.body);
      res.render("books/new-book", {
        newBook,
        errors: error.errors,
        title: "New Book",
      });
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
});

// Getting a book
router.get("/:id", async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/update-book", { book, title: book.title });
  } else {
    const error = new Error();
    error.status = 404;
    error.message = "The book you are looking for is not present in thee database";
    next(error);
  }
});

/* Updating a book. */
router.post("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct book gets updated
      res.render("books/update-book", {
        book,
        errors: error.errors,
        title: "Update Book",
      });
    } else {
      throw error;
    }
  }
});

// Deletes a book
router.post("/:id/delete", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/");
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
 