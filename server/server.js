require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan"); // Import logging middleware
const helmet = require("helmet");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");
const { resetPassword, authMiddleware } = require("./controllers/auth/auth-controller"); 

const sendOrderAlertEmail = require('./utils/sendOrderAlertEmail');
const orderEmailService = require('./utils/orderEmailService');
const path = require('path');
const Order = require('./models/Order');
const { v4: uuidv4 } = require('uuid'); 


mongoose.connect(
  'mongodb+srv://pitstopparadiseholdings:qTMk4wFkGC0S01Ad@cluster0.eehl7.mongodb.net/'
).then(() => console.log('Mongo connected'))
.catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev')); 
app.use(helmet());

app.use(
  cors({
    origin : 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders : [
      "Content-Type",
      'Authorization',
      'Cache-Control',
      'Expires',
      'Pragma',
    ],
    credentials : true
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Authentication check route
app.get('/api/auth/check-auth', authMiddleware, (req, res) => {
  const user = req.user; // Access user from middleware
  res.status(200).json({ message: 'Authenticated', user });
});


app.use('/api/auth', authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

// Adding the sendOrderAlertEmail route
app.post('/api/auth/send-order-alert-email', async (req, res) => {
  const { customerEmail, orderDetails } = req.body;

  if (!customerEmail || !orderDetails) {
    return res.status(400).json({ message: 'Customer email and order details are required.' });
  }

  try {
    await                            ({
      to: customerEmail,
      subject: 'Your Order Confirmation',
      orderDetails
    });

    res.status(200).json({ message: 'Order alert email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send order alert email', error });
  }
});
 

app.post('/api/create-order', async (req, res) => {
  try {
    const orderData = req.body;

    // Debugging: Log the received data
    console.log('Received order data:', orderData);

    const { userId, cartItems, shippingCost, totalAmount, addressInfo } = orderData;

    if (!userId || !cartItems || !shippingCost || !totalAmount || !addressInfo) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, cartItems, shippingCost, totalAmount, or addressInfo',
      });
    }

    const date = new Date();

    // Create a new order document
    const newOrder = new Order({
      userId,
      cartItems,
      shippingCost,
      totalAmount,
      addressInfo,
      orderStatus: 'Pending',
      orderDate: date,
      orderUpdateDate: date,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();
    console.log('Saved order in DB:', savedOrder);

    // Send email notification with orderId
    const result = await orderEmailService(orderData, savedOrder._id);

    if (result.success) {
      return res.json({
        success: true,
        message: 'Order placed and email sent successfully',
        orderId: savedOrder._id,
      });
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error('Unhandled error in /api/create-order:', error);
    return res.status(500).json({
      success: false,
      error: 'Unexpected error occurred while processing the order.',
    });
  }
});

app.get('/api/shop/order/list/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId });
    if (orders.length > 0) {
      return res.json({ data: orders });
    } else {
      return res.status(404).json({ error: 'No orders found for this user' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});




app.use(express.static(path.join(__dirname, 'client', 'public')));

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));

