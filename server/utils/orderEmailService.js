const path = require('path');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

// Function to generate the PDF

const generateOrderConfirmationPDF = (orderData,orderId) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    // Stream PDF into buffers
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    // Correct logo path using path module to resolve the absolute path
    const logoPath = path.join(__dirname, '..', 'invoice', 'logo.png');
    console.log('Logo file path:', logoPath); // Log the path to debug

    // Add the company logo (use local file path instead of URL)
    doc.image(logoPath, {
      fit: [150, 150],
      align: 'left',
      valign: 'top',
      x: 50,
      y: 50,
    });

    // Ensure content starts below the logo with sufficient space
    doc.moveDown(4);

    // Title: Order Confirmation
    doc.fontSize(20).fillColor('#361C6C').text('Order Confirmation', { align: 'center' });
    doc.moveDown(2);

    // Thank you message
    doc.fontSize(12).fillColor('#000000').text('Thank you for your purchase! Here are your order details:', { align: 'left' });

    // Reference
  
    const orderIdReference = orderId.toString().slice(0, 8); // Use first 8 characters of ObjectId
    doc.fontSize(12).fillColor('#FF0000').text(`Reference: ${orderIdReference}`, { align: 'left' });
    // Order details (cart items)
    doc.moveDown();
    if (orderData.cartItems && Array.isArray(orderData.cartItems)) {
      orderData.cartItems.forEach((item) => {
        doc.fontSize(12).fillColor('#000000').text(`Product: ${item.title}`);
        doc.text(`Quantity: ${item.quantity}`);
        doc.text(`Price: R${item.price}`);
        doc.moveDown();
      });
    } else {
      doc.text('No items found in the cart.');
    }

    // Shipping Cost
    doc.moveDown();
    doc.text(`Shipping: R${orderData.shippingCost}`);

    // Total Amount
    doc.moveDown();
    doc.fontSize(14).fillColor('#FF0000').text(`Total Amount: R${orderData.totalAmount}`, { bold: true });

    // Bank Account Details Section
    doc.moveDown();
    doc.fontSize(12).fillColor('#000000').text('Bank Details for EFT:', { underline: true });
    doc.moveDown();
    doc.text('Account Number: 1234567890');
    doc.text('Bank Name: Example Bank');
    doc.text('Branch Code: 001234');

    // Footer
    doc.moveDown(4);
    doc.fontSize(10).fillColor('#000000').text('We will notify you once your order has shipped.', { align: 'center' });

    // End the document
    doc.end();
  });
};

// Function to send the order email
const sendOrderEmail = (orderData, pdfData) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SALES_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const userIdReference = orderData.userId ? orderData.userId.slice(0, 7) : 'N/A';

  const mailOptions = {
    from: process.env.SALES_EMAIL,
    to: orderData.addressInfo.email,
    subject: 'Order Confirmation',
    html: `
      <div style="border: 6px solid #FF6347; padding: 20px; border-radius: 10px;">
        <h1>Order Confirmation</h1>
        <p>Thank you for your purchase! Please check the attached invoice for payment information.</p>
        <p>We will notify you once your order has shipped.</p>
        <p style="color: #0000FF;">Kind regards.</p>
        <p>Pitstop Paradise.</p>
      </div>
    `,
    attachments: [
      {
        filename: 'OrderConfirmation.pdf',
        content: pdfData,
        contentType: 'application/pdf',
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};

// Main service to generate the order confirmation and send the email

const orderEmailService = async (orderData, orderId) => {
  try {
    const pdfData = await generateOrderConfirmationPDF(orderData, orderId);
    await sendOrderEmail(orderData, pdfData);
    return { success: true, message: 'Order placed and email sent!' };
  } catch (error) {
    console.error('Error in orderEmailService:', error);
    return { success: false, message: 'Failed to process order email.', error };
  }
};


module.exports = orderEmailService;
