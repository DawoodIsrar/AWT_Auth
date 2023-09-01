const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const About = new Schema(
  {
    title: {
      type: String,
    },
    text: {
      type: String,
      maxlength: 8000,
    },
  }
);

module.exports = mongoose.model("aboutUsContent", About);
