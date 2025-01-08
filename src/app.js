require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const scrapeRoutes = require("./routes/scrapeRoutes");
const scheduleScrape = require("../tasks/scheduleScrape");

const app = express();

// Middleware
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api", scrapeRoutes);

// Schedule scraping
scheduleScrape();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
