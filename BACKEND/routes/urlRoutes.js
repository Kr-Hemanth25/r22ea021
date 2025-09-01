const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const Url = require("../models/Url");
const Click = require("../models/Click");

// Create Short URL
router.post("/shorturls", async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    if (!url) return res.status(400).json({ error: "URL is required" });

    let code = shortcode || nanoid(6);
    const exists = await Url.findOne({ shortcode: code });
    if (exists) return res.status(400).json({ error: "Shortcode already taken" });

    const expiry = new Date(Date.now() + validity * 60000);

    const newUrl = new Url({ shortcode: code, originalUrl: url, expiry });
    await newUrl.save();

    res.status(201).json({
      shortLink: `http://localhost:5000/${code}`,
      expiry
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Redirect + Track Clicks
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const urlData = await Url.findOne({ shortcode: code });

    if (!urlData) return res.status(404).json({ error: "URL not found" });
    if (new Date() > urlData.expiry) return res.status(410).json({ error: "Link expired" });

    // Log click
    const click = new Click({
      shortcode: code,
      referrer: req.headers.referer || "Direct",
      location: req.ip
    });
    await click.save();

    urlData.clicks++;
    await urlData.save();

    res.redirect(urlData.originalUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Statistics
router.get("/stats/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const urlData = await Url.findOne({ shortcode: code });
    if (!urlData) return res.status(404).json({ error: "Not found" });

    const clicks = await Click.find({ shortcode: code });

    res.json({
      shortcode: code,
      originalUrl: urlData.originalUrl,
      createdAt: urlData.createdAt,
      expiry: urlData.expiry,
      totalClicks: urlData.clicks,
      clickDetails: clicks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
