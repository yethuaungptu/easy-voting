const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampaignData = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  campaignId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  uploadDate: {
    type: Date,
    default: Date.now(),
  },
  count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("camData", CampaignData);
