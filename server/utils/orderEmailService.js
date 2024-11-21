const path = require('path');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

// Function to generate the PDF
const generateOrderConfirmationPDF = (orderData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    // Stream PDF into buffers
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    // Correct logo path using path module to resolve the absolute path
    const logoPath = path.join(__dirname, '..', 'invoice', 'logo.png');
    console.log('Logo file path:', logoPath);  // Log the path to debug

    // Add the company logo (use local file path instead of URL)
    const logoHeight = 150; // Height of the logo
    const logoVerticalSpacing = 30; // Space after the logo before the title

    // Add logo with custom placement
    doc.image(logoPath, {
      fit: [150, 150],
      align: 'left',
      valign: 'top',
      x: 50,  // Adjust this to move the logo left or right
      y: 50   // Adjust the vertical position of the logo (top-left corner)
    });

    // Ensure content starts below the logo with sufficient space
    doc.moveDown(4);  // Move down enough space after the logo

    // Title: Order Confirmation, adjusted position
    const titleY = doc.y; // Current Y position after the logo

    // Title (Order Confirmation)
    doc.fontSize(20).fillColor('#361C6C').text('Order Confirmation', {
      align: 'center',
      continued: false,
      y: titleY,  // Set y-position to move the title further down
    });

    // Add margin before the next section
    doc.moveDown(2);  // Add vertical space after the title

    // Thank you message
    doc.fontSize(12).fillColor('#000000').text('Thank you for your purchase! Here are your order details:', { align: 'left' });

    // Reference
    const userIdReference = orderData.userId ? orderData.userId.slice(0, 7) : 'N/A';
    doc.moveDown();
    doc.fontSize(12).fillColor('#FF0000').text(`Reference: ${userIdReference}`, { align: 'left' });

    // Order details (cart items)
    doc.moveDown();
    if (orderData.cartItems && Array.isArray(orderData.cartItems)) {
      orderData.cartItems.forEach((item) => {
        doc.fontSize(12).fillColor('#000000').text(`Product: ${item.title}`);
        doc.fontSize(12).fillColor('#000000').text(`Quantity: ${item.quantity}`);
        doc.fontSize(12).fillColor('#000000').text(`Price: R${item.price}`);
        doc.moveDown(); // Adds space between items
      });
    } else {
      doc.fontSize(12).fillColor('#000000').text('No items found in the cart.');
    }

    // Shipping Cost
    doc.moveDown();
    doc.fontSize(12).fillColor('#000000').text(`Shipping: R${orderData.shippingCost}`);

    // Total Amount
    doc.moveDown();
    doc.fontSize(14).fillColor('#FF0000').text(`Total Amount: R${orderData.totalAmount}`, { bold: true });

    // Bank Account Details Section
    doc.moveDown();
    doc.fontSize(12).fillColor('#000000').text('Bank Details for EFT:', { underline: true });
    doc.moveDown();
    doc.fontSize(12).fillColor('#000000').text('Account Number: 1234567890');
    doc.fontSize(12).fillColor('#000000').text('Bank Name: Example Bank');
    doc.fontSize(12).fillColor('#000000').text('Branch Code: 001234');

    // Additional company details
    doc.moveDown();
    doc.fontSize(12).fillColor('#000000').text('For EFT payments, please use the above details to complete your order.');

    // Contact Information
    doc.moveDown();
    doc.fontSize(12).fillColor('#000000').text('Contact Us: 012-345-6789', { align: 'center' });

    // Footer with adjusted positioning
    const pageHeight = doc.page.height;
    const footerHeight = 30; // Set the height of the footer area
    const footerPosition = pageHeight - footerHeight - 20; // Set footer position near the bottom

    // Add footer message
    doc.fontSize(10).fillColor('#000000').text('We will notify you once your order has shipped.', { align: 'center', y: footerPosition });

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
        <p>Thank you for your purchase! Please click at the attached invoice for payment information</p>
        <p>We will notify you once your order has shipped.</p>
        <p style="color: #0000FF;">Kind regards.</p> <!-- Blue color for "Kind regards" -->
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
const orderEmailService = async (req, res) => {
  const orderData = req.body;

  try {
    // Generate the PDF
    const pdfData = await generateOrderConfirmationPDF(orderData);

    // Send the email
    await sendOrderEmail(orderData, pdfData);

    // Send a success response to the client
    return res.json({ success: true, message: 'Order placed and email sent!' });
  } catch (error) {
    console.error('Error in orderEmailService:', error);

    // Handle errors and ensure a single response is sent
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ success: false, message: 'Failed to process order email.' });
    }
  }
};

module.exports = orderEmailService;
