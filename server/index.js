const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const crypto = require("crypto");

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://bizhuhe:bizhuhepassword@twittercluster.u9gj6vy.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
connect();

app.get("/", (request, response) => {
  response.send("Hello, world!");
});

app.get("/api/users/:username", async (request, response) => {
  try {
    const user = await User.findOne({ username: request.params.username });
    if (!user) {
      return response
        .status(404)
        .json({ status: "error", error: "User not found" });
    }
    response.status(200).json({ status: "ok", user });
  } catch (err) {
    response.status(400).json({ status: "error", error: err.message });
  }
});

const jwtSecret = crypto.randomBytes(64).toString("hex");

app.post("/api/login", async (request, response) => {
  console.log(request.body);
  try {
    const user = await User.findOne({ email: request.body.email }).exec();
    if (!user) {
      response.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const passwordMatch = await bcrypt.compare(
      request.body.password,
      user.password
    );
    if (!passwordMatch) {
      response.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const token = jwt.sign({ id: user._id }, jwtSecret);
    response.status(200).json({ token });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.post("/api/register", async (request, response) => {
  console.log(request.body);
  try {
    const newPassword = await bcrypt.hash(request.body.password, 10);
    console.log("newPassword:", newPassword);
    await User.create({
      username: request.body.username,
      email: request.body.email,
      password: newPassword,
    });
    console.log("User created");
    response
      .status(200)
      .json({ status: "ok", message: "User created successfully" });
  } catch (err) {
    response.status(400).json({ status: "error", error: "Duplicate email" });
  }
});

app.listen(1337, () => {
  console.log("Server started on port 1337");
});
