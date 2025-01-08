const mongoose = require("mongoose");

const ComparisonSchema = new mongoose.Schema({
  comparedCity: String,
  data: [
    {
      label: String,
      city1Value: String,
      city2Value: String,
    },
  ],
});

const CostOfLivingSchema = new mongoose.Schema(
  {
    monthYear: { type: String, required: true, unique: true },
    baseCity: { type: String, default: "Sofia" },
    comparisons: [ComparisonSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CostOfLiving", CostOfLivingSchema);
