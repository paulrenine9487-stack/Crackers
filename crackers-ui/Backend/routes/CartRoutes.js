const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Quick health-check for this router
router.get("/test", (req, res) => {
  res.json({ ok: true, message: "Cart route working" });
});

router.get("/:userId", async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.params.userId })
      .populate("productId");

    res.json(items);
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/add", async (req, res) => {
  try {
    console.log("CART BODY:", req.body);

    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await Cart.findOne({ userId, productId });

    if (existing) {
      existing.qty += 1;
      await existing.save();
      return res.json({ message: "Cart quantity updated" });
    }

    const cartItem = new Cart({
      userId,
      productId,
      qty: 1
    });

    await cartItem.save();

    res.status(201).json({ message: "Added to cart" });

  } catch (err) {
    console.error("ADD TO CART ERROR:", err); 
    res.status(500).json({ message: err.message });
  }
});

/* ================= DELETE CART ITEM ================= */
router.delete("/:cartId", async (req, res) => {
  try {
    const deleted = await Cart.findByIdAndDelete(req.params.cartId);

    if (!deleted) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("DELETE CART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE CART ITEM QTY ================= */
router.put("/:cartId", async (req, res) => {
  try {
    const { qty } = req.body;

    if (typeof qty !== "number") {
      return res.status(400).json({ message: "Invalid qty" });
    }

    if (qty <= 0) {
      // remove item if qty <= 0
      const removed = await Cart.findByIdAndDelete(req.params.cartId);
      if (!removed) return res.status(404).json({ message: "Cart item not found" });
      return res.json({ message: "Item removed from cart" });
    }

    const updated = await Cart.findByIdAndUpdate(
      req.params.cartId,
      { qty },
      { new: true }
    ).populate("productId");

    if (!updated) return res.status(404).json({ message: "Cart item not found" });

    res.json({ message: "Cart updated", item: updated });
  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;