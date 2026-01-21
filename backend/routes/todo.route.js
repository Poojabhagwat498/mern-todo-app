const express = require("express");
const Todo = require("../models/todo.js");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * CREATE TODO (Authenticated)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      userId: req.user.id,
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * GET LOGGED-IN USER TODOS
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * UPDATE TODO (only owner's todo)
 */
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (req.body.text !== undefined) {
      todo.text = req.body.text;
    }

    if (req.body.completed !== undefined) {
      todo.completed = req.body.completed;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * DELETE TODO (only owner's todo)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
