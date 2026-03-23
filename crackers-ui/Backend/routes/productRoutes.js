const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ GET TOP SELLING PRODUCTS (LIMITED)
router.get("/top-selling", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ soldCount: -1 })
      .limit(5); // ✅ ONLY 5 PRODUCTS

    res.json(products);
  } catch (err) {
    console.error("TOP SELLING ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ GET NEW ARRIVALS
router.get("/new-arrivals", async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true })
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("NEW ARRIVALS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
/* ================= GET ALL PRODUCTS ================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("GET ALL PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET SINGLE PRODUCT ================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ================= ADD PRODUCT ================= */
router.post("/", async (req, res) => {
  try {
    const { name, price, category, image, isNewArrival } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price required" });
    }

    const product = new Product({
      name,
      price,
      category,
      image,
      isNewArrival
    });

    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product
    });
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE PRODUCT ================= */
router.put("/:id", async (req, res) => {
  try {
    const { name, price, category, image, isNewArrival } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, image, isNewArrival },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= DELETE PRODUCT ================= */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;