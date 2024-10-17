const express = require("express");
const bcrypt = require("bcrypt"); 
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  resetPassword,
} = require("../../controllers/auth/auth-controller");
const User = require("../../models/User"); 
const router = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// User Logout
router.post("/logout", logoutUser);

// Check Auth Middleware
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

// Request Password Reset
router.post("/forgot-password", forgotPassword); 

// Verify Reset Password Token
router.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;

  console.log('api call', res)
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    res.status(200).json({ success: true, message: "Token is valid, proceed to reset password" });

  } catch (error) {
    console.error("Error verifying reset token: ", error);
    res.status(500).json({ success: false, message: "An error occurred while verifying the token" });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log("Token:", token, "Password:", password);

  if (!password) {
    return res.status(400).json({ success: false, message: "Password is required." });
  }

  // Example logic for resetting password (ensure your logic is correct)
  try {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;


