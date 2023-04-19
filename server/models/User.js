const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
    bio: { type: String, required: false },
    avatar: {
      type: String,
      default: "http://www.gravatar.com/avatar/?d=mp",
    },
    tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }],
  },
  { collection: "users" }
);

const UserModel = mongoose.model("UserData", User);

module.exports = UserModel;
