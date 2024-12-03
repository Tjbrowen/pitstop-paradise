const mongoose = require("mongoose");

const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, guestId, productId, quantity, flavor } = req.body;

    if ((!userId && !guestId) || !productId || isNaN(quantity) || quantity <= 0 || !flavor || typeof flavor !== 'string') {
      return res.status(400).json({ success: false, message: "Invalid data provided!" });
    }

    // Find the product to ensure it exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Determine the cart owner based on userId or guestId
    const cartOwnerId = userId || guestId;

    // Find the cart for the user or guest
    let cart = await Cart.findOne({
      $or: [{ userId: cartOwnerId }, { guestId: cartOwnerId }],
    });

    // If no cart exists, create a new one for the user/guest
    if (!cart) {
      cart = new Cart({
        userId: userId || null,    // userId will be null if logged out
        guestId: guestId || null,  // guestId is used if logged out
        items: [],
      });
    }

    // Find the product in the cart
    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.flavor === flavor
    );

    // Add new product or update quantity
    if (productIndex === -1) {
      cart.items.push({ productId, quantity, flavor });
    } else {
      cart.items[productIndex].quantity += quantity;
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding product to cart" });
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
      flavor: item.flavor,
    }));

    res.status(200).json({ success: true, data: { ...cart._doc, items: populatedItems } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity, flavor } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid data provided!" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.flavor === flavor
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({ success: false, message: "Cart item not present!" });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    cart.items[findCurrentProductIndex].flavor = flavor
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
      flavor: item.flavor, 
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
    const { userId, productId, flavor } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "Invalid data provided!" });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId._id.toString() === productId &&
          (flavor === undefined || item.flavor === flavor)
        )
    );

    await cart.save();

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
      flavor: item.flavor,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Error deleting cart item:", error.message || error);
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};
