import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },

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
    pincode: String,
    country: String
  },

  paymentStatus: {
    type: String,
    default: "Paid"
  },

  totalAmount: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Order", orderSchema);