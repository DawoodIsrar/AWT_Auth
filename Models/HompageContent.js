const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const homepageContent = new Schema(
  {
    title: {
      type: String,
    },
    text: {
      type: String,
      maxlength: 1000,
    },
  }
);

module.exports = mongoose.model("HomepageContent", homepageContent);
