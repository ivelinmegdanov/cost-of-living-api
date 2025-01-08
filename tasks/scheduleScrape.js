const schedule = require("node-schedule");
const scrapeCostOfLiving = require("../src/services/scraper");
const CostOfLiving = require("../src/models/costOfLiving");
require("dotenv").config();

const scheduleScrape = () => {
  // Get the scrape day from .env or default to 1
  const scrapeDay = process.env.SCRAPE_DAY || 1;

  // Validate the scrape day to ensure it's between 1 and 28 (to avoid scheduling issues for all months)
  const validScrapeDay = Math.min(Math.max(scrapeDay, 1), 28);

  // Schedule the job based on the configured day
  const cronExpression = `0 0 ${validScrapeDay} * *`; // At 00:00 on the valid day of each month

  schedule.scheduleJob(cronExpression, async () => {
    console.log(`Running scheduled scrape for day ${validScrapeDay}...`);

    const currentMonthYear = `${new Date().getMonth() + 1}.${new Date()
      .getFullYear()
      .toString()
      .slice(-2)}`; // Format: MM.YY

    try {
      const scrapedData = await scrapeCostOfLiving();

      const existingRecord = await CostOfLiving.findOne({
        monthYear: currentMonthYear,
      });
      if (existingRecord) {
        existingRecord.comparisons = scrapedData;
        await existingRecord.save();
        console.log(`Data for ${currentMonthYear} updated successfully.`);
      } else {
        const newEntry = new CostOfLiving({
          monthYear: currentMonthYear,
          baseCity: "Sofia",
          comparisons: scrapedData,
        });
        await newEntry.save();
        console.log(`Data for ${currentMonthYear} saved successfully.`);
      }
    } catch (err) {
      console.error("Scheduled scraping failed", err.message);
    }
  });

  console.log(
    `Scrape schedule configured for day ${validScrapeDay} of each month.`
  );
};

module.exports = scheduleScrape;
