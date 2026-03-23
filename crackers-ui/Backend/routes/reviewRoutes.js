const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

/* ================= ADD REVIEW ================= */
router.post("/", async (req, res) => {
  try {
    const { userId, name, rating, comment } = req.body;

    const review = new Review({
      userId,
      name,
      rating,
      comment
    });

    await review.save();

    res.json({ message: "Review added" });
  } catch (err) {
    console.error("REVIEW ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET REVIEWS ================= */
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;