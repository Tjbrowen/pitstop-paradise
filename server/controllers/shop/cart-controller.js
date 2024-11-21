const mongoose = require("mongoose");

const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    // Destructure and validate input data from request body
    const { userId, productId, quantity, selectedFlavor, guestId } = req.body;

    // Validate required fields: either userId or guestId must be provided, and quantity must be positive
    if ((!userId && !guestId) || !productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid data provided!" });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Identify the cart owner: either userId or guestId
    const cartOwnerId = userId || guestId;
    
    // Find or create a cart for the identified cart owner
    let cart = await Cart.findOne({ userId: cartOwnerId });
    if (!cart) {
      cart = new Cart({ userId: cartOwnerId, items: [] });
    }

    // Find if the specific product with selectedFlavor already exists in the cart
    const productIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId && item.selectedFlavor === selectedFlavor
    );

    // If product with flavor exists, update the quantity; otherwise, add new item with selected flavor
    if (productIndex === -1) {
      cart.items.push({ productId, quantity, selectedFlavor });
    } else {
      cart.items[productIndex].quantity += quantity;
    }

    // Save the cart
    await cart.save();
    res.status(200).json({ success: true, data: cart });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId, guestId } = req.params;

    if (!userId && !guestId) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      return res.status(200).json({ success: true, data: guestCart });
    }

    const cart = await Cart.findOne({ userId: userId || guestId }).populate({
      path: "items.productId",
      select: "image title price salePrice flavor",
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    const validItems = cart.items.filter(item => item.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populatedItems = validItems.map(item => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
      selectedFlavor: item.selectedFlavor,
    }));

    res.status(200).json({ success: true, data: { ...cart._doc, items: populatedItems } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity, selectedFlavor } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid data provided!" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.selectedFlavor === selectedFlavor
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({ success: false, message: "Cart item not present!" });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    cart.items[findCurrentProductIndex].selectedFlavor = selectedFlavor
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
      selectedFlavor: item.selectedFlavor, 
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId, selectedFlavor } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "Invalid data provided!" });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice flavor",
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    cart.items = cart.items.filter(
      (item) => !(item.productId._id.toString() === productId && item.selectedFlavor === selectedFlavor)
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice ",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
      selectedFlavor: item.selectedFlavor,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};
