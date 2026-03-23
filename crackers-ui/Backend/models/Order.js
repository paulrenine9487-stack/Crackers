const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  userId: String,

  products: [
    {
      productId: String,
      name: String,
      price: Number,
      qty: Number
    }
  ],

  shipping: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },

  total: Number,

  paymentMethod: String,

  status: {
    type: String,
    default: "Placed"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Order", orderSchema);