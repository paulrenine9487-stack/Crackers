const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");

/* ================= PLACE ORDER ================= */
router.post("/", async (req, res) => {
  try {
    const { userId, products, total, paymentMethod, shipping } = req.body;

    const order = new Order({
      userId,
      products,
      total,
      paymentMethod,
      shipping,
      status: "Placed"
    });

    await order.save();

    // ✅ Increase sold count
    if (Array.isArray(products)) {
      for (const item of products) {
        const productId = item.productId?._id || item.productId;

        if (productId) {
          await Product.findByIdAndUpdate(
            productId,
            { $inc: { soldCount: item.qty || 1 } }
          );
        }
      }
    }

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ error: "Order failed" });
  }
});


/* ================= USER ORDERS ================= */
router.get("/user/:id", async (req, res) => {
  try {

    const orders = await Order.find({ userId: req.params.id });

    res.json(orders);

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }
});


/* ================= ALL ORDERS ================= */
router.get("/", async (req, res) => {
  try {

    const orders = await Order.find().populate('userId', 'name email');

    res.json(orders);

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }
});


/* ================= UPDATE ORDER STATUS ================= */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;