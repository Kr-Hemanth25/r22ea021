const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  shortcode: { type: String, unique: true, required: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  clicks: { type: Number, default: 0 }
});

module.exports = mongoose.model("Url", urlSchema);
