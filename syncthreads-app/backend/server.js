const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "mysecretkey";

app.use(cors());
app.use(bodyParser.json());

const users = [{ username: "admin", password: "password123" }];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: "User not logged in" });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

app.get("/api/dashboard", authenticate, (req, res) => {
  res.json({ cards: [{ id: 1, title: "Map View" }, { id: 2, title: "Statistics" }] });
});

app.get("/api/map", authenticate, (req, res) => {
  res.json({ center: [20.5937, 78.9629], zoom: 5 });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
