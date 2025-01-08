const CostOfLiving = require("../models/costOfLiving");
const scrapeCostOfLiving = require("../services/scraper");

exports.getCostOfLiving = async (req, res) => {
  const { monthYear } = req.query;
  try {
    if (monthYear) {
      // Fetch data for the specified month
      const data = await CostOfLiving.findOne({ monthYear });
      if (!data) {
        return res
          .status(404)
          .json({ error: `Data for ${monthYear} not found.` });
      }
      return res.status(200).json(data);
    } else {
      // Return all entries if no filter is provided
      const allData = await CostOfLiving.find().sort({ createdAt: -1 }); // Sort by creation date descending
      if (!allData.length) {
        return res.status(404).json({ error: "No data available." });
      }
      return res.status(200).json(allData); // Return all entries
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch data", details: err.message });
  }
};

exports.scrapeData = async (req, res) => {
  const currentMonthYear = `${new Date().getMonth() + 1}.${new Date()
    .getFullYear()
    .toString()
    .slice(-2)}`; // Format: MM.YY

  try {
    const existingRecord = await CostOfLiving.findOne({
      monthYear: currentMonthYear,
    });

    // Scrape new data
    const scrapedData = await scrapeCostOfLiving();

    if (existingRecord) {
      // Update existing record
      existingRecord.comparisons = scrapedData;
      await existingRecord.save();
      return res.status(200).json({
        message: `Data for ${currentMonthYear} updated successfully.`,
        data: existingRecord,
      });
    } else {
      // Create new record
      const newEntry = new CostOfLiving({
        monthYear: currentMonthYear,
        baseCity: "Sofia",
        comparisons: scrapedData,
      });
      await newEntry.save();
      return res.status(200).json({
        message: `Data for ${currentMonthYear} saved successfully.`,
        data: newEntry,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scraping failed", details: err.message });
  }
};
