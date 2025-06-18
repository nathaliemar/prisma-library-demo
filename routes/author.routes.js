const express = require("express");
const router = express.Router();

const prisma = require("../db/index");

//  POST /api/authors  -  Creates a new author
router.post("/authors", async (req, res, next) => {
  const { firstName, lastName, bio } = req.body;

  const newAuthor = {
    firstName,
    lastName,
    bio,
  };
  try {
    const createdAuthor = await prisma.author.create({ data: newAuthor });
    console.log("New author created", createdAuthor);
    res.status(201).json(createdAuthor);
  } catch (error) {
    console.log("Error creating new author", error);
    res.status(500).json({ message: "Error creating new author" });
  }
});
module.exports = router;
