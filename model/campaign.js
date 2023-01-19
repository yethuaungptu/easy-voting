const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Campaign = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  select: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("campaign", Campaign);
