const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const Users = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      maxlength: 8000,
    },
    secret: {
      type: String,
    }
  }
);

module.exports = mongoose.model("users", Users);
