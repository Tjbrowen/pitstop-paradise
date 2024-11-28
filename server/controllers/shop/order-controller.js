require("dotenv").config();
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Order = require("../../models/Order");

// Function to capture payment
const capturePayment = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Payment captured successfully." });
  } catch (error) {
    console.error("Error in capturePayment:", error);
    res.status(500).json({ success: false, message: "An error occurred while capturing the payment." });
  }
};

// Placeholder functions for other routes
const getAllOrdersByUser = async (req, res) => {
  res.status(200).json({ success: true, orders: [] });
};

const getOrderDetails = async (req, res) => {
  res.status(200).json({ success: true, order: {} });
};

// Main function to create order
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      totalAmount,
      shippingCost = 0,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    cartItems.forEach((item) => {
      
      if (!item.flavor || item.flavor.trim() === '') {
        item.flavor = 'Default Flavor';
      }
    });
    
    console.log("Cart Items with Flavor:", cartItems);

    const subtotal = cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
      0
    );
    const totalWithShipping = subtotal + shippingCost;

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      totalAmount: totalWithShipping,
      orderDate,
      orderUpdateDate,
    });
    await newlyCreatedOrder.save();

    const pdfDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);
    const pdfPath = path.join(pdfDir, `invoice_${newlyCreatedOrder._id}.pdf`);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    doc
      .fontSize(20)
      .text("Invoice", { align: "center" })
      .moveDown();
    doc.text(`Order ID: ${newlyCreatedOrder._id}`);
    doc.text(`Order Date: ${orderDate}`);
    doc.text(`Total: R${totalWithShipping.toFixed(2)}`, { align: "right" });
    cartItems.forEach((item) => {
      doc.text(
        `${item.title} - Quantity: ${item.quantity}, Price: R${item.price}, Flavor: ${item.flavor}`
      );
      
      
    });
    doc.end();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: addressInfo.email,
      subject: "Your Order Invoice",
      text: "Thank you for your order! Please find your invoice attached.",
      attachments: [
        {
          filename: `invoice_${newlyCreatedOrder._id}.pdf`,
          path: pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Order created and invoice sent via email.",
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.error("Error in createOrder:", e);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the order or sending the invoice.",
    });
  }
};

// Export all functions
module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
