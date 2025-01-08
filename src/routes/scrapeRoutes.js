const express = require("express");
const router = express.Router();
const scrapeController = require("../controllers/scrapeController");

// Routes
router.get("/data", scrapeController.getCostOfLiving);
router.post("/scrape", scrapeController.scrapeData);

module.exports = router;
