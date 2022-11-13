const express = require("express");
const path = require("path");
const app = express();

const port = 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

// handle new user registeration
app.post("/register", (req, res) => {
  console.log(req.body);
  res.status(200).send();
});

// handle login
app.post("/login", (req, res) => {
  console.log(req.body);
  res.status(200).send();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
