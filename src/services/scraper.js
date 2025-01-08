const puppeteer = require("puppeteer");
const { comparisonCities, baseCity } = require("../utils/constants");

const scrapeCostOfLiving = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const results = [];

  for (const { city, country } of comparisonCities) {
    try {
      const url = `https://www.numbeo.com/cost-of-living/compare_cities.jsp?country1=${encodeURIComponent(
        baseCity.country
      )}&city1=${encodeURIComponent(
        baseCity.city
      )}&country2=${encodeURIComponent(country)}&city2=${encodeURIComponent(
        city
      )}`;

      console.log(`Scraping: ${url}`);

      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

      const data = await page.evaluate(() => {
        const rows = Array.from(
          document.querySelectorAll(".data_wide_table tr")
        );
        return rows
          .map((row) => ({
            label:
              row.querySelector("td:nth-child(1)")?.innerText.trim() || null,
            city1Value:
              row.querySelector("td:nth-child(2)")?.innerText.trim() || null,
            city2Value:
              row.querySelector("td:nth-child(3)")?.innerText.trim() || null,
          }))
          .filter((row) => row.label);
      });

      results.push({ comparedCity: city, data });
    } catch (err) {
      console.error(
        `Failed to scrape data for ${city}, ${country}: ${err.message}`
      );
    }
  }

  await browser.close();
  return results;
};

module.exports = scrapeCostOfLiving;
