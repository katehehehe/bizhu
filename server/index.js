const express = require("express");
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const crypto = require("crypto");
const UserModel = require("./models/User");
const PostModel = require("./models/TweetPost");

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

// users can get their information through username
app.get("/api/users/:username", async (request, response) => {
  try {
    const user = await UserModel.findOne({ username: request.params.username });
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

// post the user information when they log in
app.post("/api/login", async (request, response) => {
  console.log(request.body);
  try {
    const user = await UserModel.findOne({ email: request.body.email }).exec();
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
    response.status(200).json({ token, name: user.username });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});
// post the user information when they register
app.post("/api/register", async (request, response) => {
  console.log(request.body);
  try {
    const newPassword = await bcrypt.hash(request.body.password, 10);
    console.log("newPassword:", newPassword);
    await UserModel.create({
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

// get all tweet posts
app.get("/api/tweets", async (request, response) => {
  try {
    const tweetPosts = await PostModel.find();
    response.status(200).json({ status: "ok", tweetPosts });
  } catch (err) {
    response.status(400).json({ status: "error", error: err.message });
  }
});

// get a single tweet by id
app.get("/api/tweets/:id", async (request, response) => {
  try {
    const tweetPost = await PostModel.findById(request.params.id);
    if (!tweetPost) {
      return response
        .status(404)
        .json({ status: "error", error: "Tweet post not found" });
    }
    response.status(200).json({ status: "ok", tweetPost });
  } catch (err) {
    response.status(400).json({ status: "error", error: err.message });
  }
});

// post a new tweet post
app.post("/api/tweet", async (request, response) => {
  try {
    const { content } = request.body;
    console.log("this is the content" + request.body);
    const tweetPost = await PostModel.create({ content });
    console.log("tweetPost created successfully" + tweetPost);
    response.status(200).json({ status: "ok", tweetPost });
  } catch (err) {
    response.status(400).json({ status: "error", error: err.message });
  }
});
// app.post("/api/tweet", async (request, response) => {
//   try {
//     const { content } = request.body;
//     const token = request.headers.authorization;
//     const decoded = jwt.verify(token, secretKey);
//     const user = await UserModel.findById(decoded.userId);
//     if (!user) {
//       return response
//         .status(404)
//         .json({ status: "error", error: "User not found" });
//     }
//     const tweetPost = await PostModel.create({ content, user: user._id });
//     user.tweetPosts.push(tweetPost._id);
//     await user.save();
//     response.status(200).json({ status: "ok", tweetPost });
//   } catch (err) {
//     response.status(400).json({ status: "error", error: err.message });
//   }
// });

app.listen(1337, () => {
  console.log("Server started on port 1337");
});
