const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      default: "General"
    },
    image: {
      type: String, // base64 or URL
      default: ""
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    soldCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);