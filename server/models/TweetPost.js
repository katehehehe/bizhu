const mongoose = require("mongoose");

const TweetPost = new mongoose.Schema(
  {
    username: { type: String, required: true },
    content: { type: String, required: true },
    image: { data: Buffer, contentType: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "tweet-posts" }
);

const PostModel = mongoose.model("TweetPost", TweetPost);

module.exports = PostModel;
