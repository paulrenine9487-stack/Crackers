const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Subscriber = require("../models/Subscriber");

/* ================= SUBSCRIBE ================= */
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const exists = await Subscriber.findOne({ email });

    if (exists) {
      return res.json({ message: "Already subscribed" });
    }

    await Subscriber.create({ email });

    res.json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= SEND OFFER (ADMIN) ================= */
router.post("/send-offer", async (req, res) => {
  try {
    const { subject, message } = req.body;

    const subscribers = await Subscriber.find();

    // ✅ configure mail (Gmail example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    for (const sub of subscribers) {
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: sub.email,
        subject: subject || "Latest Offers 🎉",
        html: `<h3>${message}</h3>`
      });
    }

    res.json({ message: "Offers sent to all subscribers" });

  } catch (err) {
    console.error("Send offer error:", err);
    res.status(500).json({ message: "Failed to send emails" });
  }
});

module.exports = router;