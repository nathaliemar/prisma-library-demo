const express = require("express");
const router = express.Router();

const prisma = require("../db/index");

//POST /api/books - Creates a new book

router.post("/books", async (req, res, next) => {
  const { title, year, summary, quantity, genre, authorId } = req.body;

  const newBook = {
    title,
    year,
    summary,
    quantity,
    genre,
    authorId,
  };
  try {
    const createdBook = await prisma.book.create({ data: newBook });
    console.log("New book created", createdBook);
    res.status(201).json(createdBook);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating new book" });
  }
});

//  GET /api/books -  Retrieves all of the books
router.get("/books", async (_, res) => {
  try {
    const foundBooks = await prisma.book.findMany({
      include: { author: true },
    });
    res.json(foundBooks);
  } catch (error) {
    console.log("Error getting books from DB", error);
    res.status(500).json({ message: "Error getting books from DB" });
  }
});

//  GET /api/books/:bookId -  Retrieves a specific book by id
router.get("/books/:bookId", async (req, res, next) => {
  const { bookId } = req.params;
  try {
    const foundBook = await prisma.book.findUnique({
      where: { id: bookId },
      include: { author: true },
    });
    if (!foundBook) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.json(foundBook);
    }
  } catch (error) {
    console.log("Error getting book from DB", error);
    res.status(500).json({ message: "Error getting book from DB" });
  }
});

// PUT  /api/books/:bookId  -  Updates a specific book by id
router.put("/books/:bookId", async (req, res, next) => {
  const { bookId } = req.params;
  const { title, year, summary, quantity, genre, authorId } = req.body;

  const newBookDetails = {
    title,
    year,
    summary,
    quantity,
    genre,
    authorId,
  };

  try {
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: newBookDetails,
    });
    res.json(updatedBook);
  } catch (error) {
    console.log("Error updating a book", error);
    res.status(500).json({ message: "Error updating a book" });
  }
});

// DELETE  /api/books/:bookId  -  Deletes a specific book by id
router.delete("/books/:bookId", async (req, res, next) => {
  const { bookId } = req.params;
  try {
    await prisma.book.delete({ where: { id: bookId } });
    res.json({ message: `Book with id ${bookId} was deleted successfully` });
  } catch (error) {
    console.log("Error deleting a book", error);
    res.status(500).json({ message: "Error deleting a book" });
  }
});

module.exports = router;
