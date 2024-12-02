const path = require('path');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

// Function to generate the PDF
const generateOrderConfirmationPDF = (orderData, orderId) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    // Stream PDF into buffers
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    // Correct logo path using path module
    const logoPath = path.join(__dirname, '..', 'invoice', 'logo.png');
    console.log('Logo file path:', logoPath);

    // Add the company logo
    doc.image(logoPath, {
      fit: [150, 150],
      align: 'left',
      valign: 'top',
      x: 50,
      y: 50,
    });

    // Content starts below the logo
    doc.moveDown(4);
    doc.fontSize(20).fillColor('#361C6C').text('Order Confirmation', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).fillColor('#000000').text('Thank you for your purchase! Here are your order details:', { align: 'left' });

    // Reference
    const orderIdReference = `INV-${orderId.toString().slice(-8)}`;
    doc.fontSize(12).fillColor('#FF0000').text(`Reference: ${orderIdReference}`, { align: 'left' });

    // Order details
    doc.moveDown();
    if (orderData.cartItems && Array.isArray(orderData.cartItems)) {
      orderData.cartItems.forEach((item) => {
        const flavorText = item.flavor || 'Not Specified';
        doc.fontSize(12).fillColor('#000000').text(`Product: ${item.title}`);
        doc.text(`Quantity: ${item.quantity}`);
        doc.text(`Price: R${item.price}`);
        doc.text(`Flavor: ${flavorText}`);
        doc.moveDown();
      });
    } else {
      doc.text('No items found in the cart.');
    }

    // Shipping and total amount
    doc.moveDown();
    doc.text(`Shipping: R${orderData.shippingCost}`);
    doc.moveDown();
    doc.fontSize(14).fillColor('#FF0000').text(`Total Amount: R${orderData.totalAmount}`, { bold: true });

    // Bank details
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

// Function to send emails
const sendOrderEmail = async (orderData, pdfData, orderId) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SALES_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Customer email
  const customerMailOptions = {
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

  // Admin notification email
  const adminMailOptions = {
    from: process.env.SALES_EMAIL,
    to: process.env.SALES_EMAIL,
    subject: 'New Order Received',
    html: `
  <div style="border: 6px solid #FF6347; padding: 20px; border-radius: 10px;">
  <h1>New Order Notification</h1>
  <p>A new order has been placed by ${orderData.addressInfo.name}.</p>
  <p><strong>Order ID:</strong> INV-${orderId.toString().slice(-8)}</p>
  <p><strong>Customer Email:</strong> ${orderData.addressInfo.email}</p>
  <p><strong>Customer Phone Number:</strong> ${orderData.addressInfo.phone}</p>
  <p><strong>Total Amount:</strong> R${orderData.totalAmount}</p>
  <p><strong>Order Details:</strong></p>
  <ul>
    ${
      Array.isArray(orderData.cartItems)
        ? orderData.cartItems
            .map(
              (item) =>
                `<li>
                  <p><strong>Product:</strong> ${item.title}</p>
                  <p><strong>Quantity:</strong> ${item.quantity}</p>
                  <p><strong>Price:</strong> R${item.price}</p>
                  <p><strong>Flavor:</strong> ${item.flavor || 'Not Specified'}</p>
                </li>`
            )
            .join('')
        : '<li>No items in the cart.</li>'
    }
  </ul>
  <p>Shipping Cost: R${orderData.shippingCost}</p>
  <p style="color: #0000FF;">Kind regards.</p>
  <p>Pitstop Paradise Team.</p>
</div>


    `,
  };

  // Send both emails
  return Promise.all([
    transporter.sendMail(customerMailOptions),
    transporter.sendMail(adminMailOptions),
  ]);
};

// Main service to generate PDF and send emails
const orderEmailService = async (orderData, orderId) => {
  try {
    const pdfData = await generateOrderConfirmationPDF(orderData, orderId);
    await sendOrderEmail(orderData, pdfData, orderId);
    return { success: true, message: 'Order placed and emails sent!' };
  } catch (error) {
    console.error('Error in orderEmailService:', error);
    return { success: false, message: 'Failed to process order email.', error };
  }
};

module.exports = orderEmailService;
