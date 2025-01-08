const CostOfLiving = require("../models/costOfLiving");
const scrapeCostOfLiving = require("../services/scraper");

exports.getCostOfLiving = async (req, res) => {
  const { monthYear, city } = req.query;

  try {
    const query = {};

    // Add filters for parent document
    if (monthYear) query.monthYear = monthYear;
    if (city) {
      query.comparisons = {
        $elemMatch: { comparedCity: { $regex: new RegExp(city, "i") } },
      };
    }

    // Fetch data based on the query
    const data = await CostOfLiving.find(query).sort({ createdAt: -1 });

    if (!data.length) {
      return res
        .status(404)
        .json({ error: `No data found for the specified filters.` });
    }

    // Filter comparisons to include only the matching city
    const filteredData = data.map((doc) => {
      const filteredComparisons = city
        ? doc.comparisons.filter((comp) =>
            comp.comparedCity.match(new RegExp(city, "i"))
          )
        : doc.comparisons;

      return {
        ...doc.toObject(),
        comparisons: filteredComparisons,
      };
    });

    // Return only entries with comparisons after filtering
    const nonEmptyResults = filteredData.filter(
      (doc) => doc.comparisons && doc.comparisons.length > 0
    );

    if (!nonEmptyResults.length) {
      return res
        .status(404)
        .json({ error: `No comparisons found for the specified filters.` });
    }

    return res.status(200).json(nonEmptyResults);
  } catch (err) {
    console.error("Error fetching cost of living data:", err);
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
