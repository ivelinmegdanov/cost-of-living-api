const schedule = require("node-schedule");
const scrapeCostOfLiving = require("../src/services/scraper");
const CostOfLiving = require("../src/models/costOfLiving");

const scheduleScrape = () => {
  schedule.scheduleJob("0 0 10 * *", async () => {
    console.log("Running scheduled scrape...");

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
};

module.exports = scheduleScrape;
