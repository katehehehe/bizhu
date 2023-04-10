const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, required: false },
    avatar: {
      type: String,
      default: "http://www.gravatar.com/avatar/?d=mp",
    },
  },
  { collection: "user-data" }
);

const UserModel = mongoose.model("UserData", User);

module.exports = UserModel;
