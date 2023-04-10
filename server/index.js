const express = require("express");
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const crypto = require("crypto");
const UserModel = require("./models/User");
const PostModel = require("./models/TweetPost");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const fs = require("fs");
const { application } = require("express");

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
const jwtSecret = crypto.randomBytes(64).toString("hex");

app.get("/", (request, response) => {
  response.send("Hello, world!");
});

app.get("/api/me", (req, res) => {
  // Get the JWT token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    // If the token is not present in the header, return a 401 Unauthorized status
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    // Return the decoded user data
    return res.json(decoded.user);
  } catch (err) {
    // If the token is invalid or expired, return a 401 Unauthorized status
    return res.status(401).json({ message: "Unauthorized" });
  }
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
    // const token = jwt.sign({ id: user._id }, jwtSecret);
    const token = jwt.sign({ email: request.body.email }, jwtSecret, {
      expiresIn: "2h",
    });

    response.status(200).json({ token, name: user.username });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});
// app.post("/api/login", async (req, res) => {
//   try {
//     const user = await UserModel.findOne({
//       email: req.body.email,
//       password: req.body.password,
//     });

//     if (!user) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const accessToken = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.ACCESS_TOKEN_SECRET
//     );

//     res.json({ token: accessToken });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });
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

// the backend code that supports image upload

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden" });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};
// app.post("/api/tweet", upload.single("image"), (request, response) => {
//   const tweetPost = new PostModel({
//     content: request.body.content,
//     image: {
//       data: fs.readFileSync("uploads/" + request.file.filename),
//       contentType: request.file.mimetype,
//     },
//   });

//   if (tweetPost) {
//     tweetPost
//       .save()
//       .then((response) => console.log("image is saved"))
//       .catch((err) => console.log(errr, "error has occurred"));

//     console.log("Tweet post created successfully");
//     response.status(200).json({ status: "ok", tweetPost });
//   } else {
//     response.status(400).json({ status: "error", error: err.message });
//   }
// });

app.post(
  "/api/tweet",
  authenticateJWT,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const tweetPost = new PostModel({
        content: req.body.content,
        image: {
          data: fs.readFileSync("uploads/" + req.file.filename),
          contentType: req.file.mimetype,
        },
        user: user._id,
      });

      await tweetPost.save();
      user.tweetPosts.push(tweetPost._id);
      await user.save();

      res.status(201).json({ tweetPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);
app.listen(1337, () => {
  console.log("Server started on port 1337");
});
