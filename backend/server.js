require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const todoRoutes = require("./routes/todo.route");
const connectionDB = require("./config/db");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/auth")

const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const User = require('./models/user.js');

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use("/api/todos", todoRoutes);
app.use("/api", authRoutes);


app.post("/api/login", (req, res) => {
  const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

res.json({
  message: "Login successful",
  token,
});
});

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Registration successful",
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.log(`ERROR: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(port, async () => {
  try {
    await connectionDB();
    console.log(`Server running at http://localhost:${port}`);
  } catch (error) {
    console.error(" Database connection failed:", error);
  }
});
