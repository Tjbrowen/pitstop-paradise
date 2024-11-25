const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cartId: { type: String, default: null },
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    postcode: String,
    phone: String,
    notes: String,
    email: String,
  },
  orderStatus: { type: String, default: 'Pending' },
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: { type: Number, required: true },
  shippingCost: { type: Number, required: true }, 
  orderDate: { type: Date, default: Date.now }, 
  orderUpdateDate: { type: Date, default: Date.now }, 
  paymentId: String,
  payerId: String,
});

module.exports = mongoose.model("Order", OrderSchema);
