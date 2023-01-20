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
  },
});

module.exports = mongoose.model("campaign", Campaign);
