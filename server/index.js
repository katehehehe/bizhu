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
const fs = require("fs");
const cookieParser = require("cookie-parser");
const path = require("path");

// app.use(
//   cors({
//      origin: "http://localhost:3000",
//     credentials: true,
//   })
// );
app.use(cors());
app.use(cookieParser());
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

function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization denied: Token not found" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.username = decoded.username;
    req.id = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Authorization denied: Invalid token" });
  }
}

// to generate the screte key for the use of token
const JWT_SECRET = crypto.randomBytes(32).toString("hex");
// the backend code that supports image upload
// configure Multer middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// GET all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving users" });
  }
});
async function createUser(username, password) {
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);

  const user = new UserModel({
    username: username,
    password: newPassword,
  });

  await user.save();

  return user;
}

app.post("/api/register", async (request, response) => {
  console.log(request.body);
  try {
    const existingUser = await UserModel.findOne({
      username: request.body.username,
    });
    if (existingUser) {
      return response
        .status(400)
        .json({ status: "error", error: "Duplicate username" });
    }
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(request.body.password, salt);
    // Make sure the password confirmation matches the password
    if (request.body.password !== request.body.confirmPassword) {
      return response
        .status(400)
        .json({ status: "error", error: "Passwords do not match" });
    }
    // Create a new user
    const newUser = await createUser(request.body.username, newPassword);
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    response.cookie("token", token, { httpOnly: true, secure: true });
    response.cookie("username", newUser.username, {
      httpOnly: true,
      secure: true,
    });
    response.status(200).json({
      status: "ok",
      message: "User created successfully",
      name: newUser.username,
      token,
    });
  } catch (err) {
    console.log(err);
    response
      .status(500)
      .json({ status: "error", error: "Registration failed" });
  }
});

// this is the user login post method
app.post("/api/login", async (request, response) => {
  try {
    const user = await UserModel.findOne({
      username: request.body.username,
    }).exec();
    if (!user) {
      response.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const passwordMatch = await bcrypt.compare(
      request.body.password,
      user.password
    );
    if (!passwordMatch) {
      response.status(401).json({ error: "Invalid username or password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    // Get username from database and attach to cookie
    const updatedUser = await UserModel.findById(user._id).exec();
    response.cookie("token", token, { httpOnly: true, secure: true });
    response.cookie("username", updatedUser.username, {
      httpOnly: true,
      secure: true,
    });
    response.status(200).json({ name: updatedUser.username, token });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});
// if a user is logged in, will return the username.
app.get("/api/isLoggedIn", async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      return res.json({ loggedIn: false });
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;
    const user = await UserModel.findById(userId).exec();

    if (!user) {
      return res.json({ loggedIn: false });
    }
    res.json({ loggedIn: true, username: user.username, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/logOut", async function (req, res) {
  res.clearCookie("username");
  res.clearCookie("token");
  res.send(true);
});

// get all usernames
app.get("/api/usernames", async (request, response) => {
  try {
    const users = await UserModel.find({}, { username: 1 });
    const usernames = users.map((user) => user.username);
    response.status(200).json(usernames);
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// POST check username availability
app.post("/api/checkusername", async (request, response) => {
  const { username } = request.body;
  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      response.status(409).json({ message: "Username is already taken" });
    } else {
      response.status(200).json({ message: "Username is available" });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// users can get their information through username
app.get("/api/users/:username", async (request, response) => {
  console.log("Received request for user:", request.params.username);
  try {
    const username = request.params.username;
    console.log("user got " + username);
    if (!username || typeof username !== "string") {
      return response
        .status(400)
        .json({ status: "error", error: "Invalid username parameter" });
    }
    const user = await UserModel.findOne({ username: request.params.username });
    console.log("this is the user ", user);
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

// this method helps to retrieve user info using id
app.get("/api/users/:id", async (request, response) => {
  try {
    const user = await UserModel.findById(request.params.id);
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
app.put(
  "/api/users/:userid",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    const { userid } = req.params;

    try {
      const user = await UserModel.findById(userid);
      console.log("check the user ", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { username, password, bio, avatar } = req.body;

      if (username) {
        user.username = username;

        // Update username in the cookie
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userId = decodedToken.userId;
        const userToUpdate = await UserModel.findById(userId);
        if (userToUpdate) {
          res.cookie("username", userToUpdate.username, { httpOnly: true });
        }
      }

      // if (email) {
      //   user.email = email;
      // }

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
      }

      if (bio) {
        user.bio = bio;
      }

      if (avatar) {
        user.avatar = avatar;
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
      console.log(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// this is to edit user information in profile
app.put(
  "/api/users/:username",
  upload.single("profileImage"),
  async (request, response) => {
    try {
      const user = await UserModel.findById(request.params.id);
      if (!user) {
        return response.status(404).send("User not found");
      }

      // if (request.body.email) {
      //   user.email = request.body.email;
      // }

      if (request.body.username) {
        user.username = request.body.username;
      }

      if (request.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(request.body.password, salt);
        user.password = hashedPassword;
      }
      if (request.body.bio) {
        user.bio = request.body.bio;
      }

      await user.save();
      console.log("user info gets updated successfully");
      response.status(200).send(user);
    } catch (error) {
      console.error(error);
      response.status(500).send("Server error");
    }
  }
);

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

// create a new tweet
app.post("/api/tweet", upload.single("image"), async (request, response) => {
  console.log(request.file);
  console.log(request.body);

  const username = request.body.username;
  const content = request.body.content;

  try {
    let tweetPost;
    if (!request.file) {
      tweetPost = new PostModel({
        username: username,
        content: content,
      });
    } else {
      tweetPost = new PostModel({
        username: username,
        content: content,
        image: {
          data: fs.readFileSync("uploads/" + request.file.filename),
          contentType: request.file.mimetype,
        },
      });
    }

    const savedTweetPost = await tweetPost.save();
    console.log("Tweet post created successfully");

    // Add tweet ID to user's tweets array
    const user = await UserModel.findOne({ username });
    user.tweets.push(savedTweetPost._id);
    await user.save();

    response.status(200).json({ status: "ok", tweetPost: savedTweetPost });
  } catch (error) {
    console.error(error);
    response.status(400).json({ status: "error", error: error.message });
  }
});

// endpoint that a user can get all their posts
app.get("/api/user/posts/:username", async (req, res) => {
  console.log("fetching all the posts from a user");
  const { username } = req.params;
  console.log("get the user from show post method ", req.username);

  try {
    const posts = await PostModel.find({ username: username }).populate(
      "image"
    );
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// Endpoint to update a tweet
app.put("/api/tweets/:id", authMiddleware, async (req, res) => {
  console.log("update a post");
  const { id } = req.params;
  const { content } = req.body;
  console.log("this is the request body ", req.body);
  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content is required" });
  }
  try {
    const tweet = await PostModel.findOne({ _id: id });

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    if (tweet && tweet.username != req.username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    tweet.content = content;
    await tweet.save();

    res.json(tweet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
// Endpoint to delete a tweet
app.delete("/api/tweets/:id", authMiddleware, async (req, res) => {
  console.log("try to delete a post");
  const { id } = req.params;
  const tweet = await PostModel.findOne({ _id: id });
  console.log(req.username);
  if (tweet && tweet.username === req.username) {
    // Delete the tweet if the authenticated user is the author
    await PostModel.deleteOne({ _id: id });
    res.status(200).send({ message: "Tweet deleted." });
  } else {
    res.status(401).send({ message: "Unauthorized to delete this tweet." });
  }
});

let client_dir = path.join(__dirname, "..", "client", "build");

app.use(express.static(client_dir));
app.get("*", function (req, res) {
  console.log("received request");
  res.sendFile(path.join(client_dir, "index.html"));
});

app.listen(process.env.PORT || 1337, () => {
  console.log("Server started on port 1337");
});
