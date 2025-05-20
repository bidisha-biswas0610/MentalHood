const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();
const sendResetEmail = require("../utils/sendResetEmail"); // adjust path if needed
// Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already taken" });

        const newUser = new User({ username, password }); // No manual hashing
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "Signup successful", token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


// Login Route
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log("Login attempt:");
        console.log("Username sent from frontend:", username);

        // Find user
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid username or password" });

        // 🔍 Debug logs
        console.log("Password from frontend:", password);
        console.log("Hashed password in DB:", user.password);

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch); // Add this too!

        if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

        // Create token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("🔥 Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Password Reset Request
 // or wherever your User model is

 router.post("/forgot-password", async (req, res) => {
    try {
      const { username } = req.body;
      console.log("Request received for username:", username);
  
      const user = await User.findOne({ username });
      if (!user) {
        console.log("User not found.");
        return res.status(200).json({ message: "If user exists, reset email sent" });
      }
  
      // Generate reset token
      user.resetToken = crypto.randomBytes(20).toString("hex");
      user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
      await user.save();
      console.log("User updated with token.");
      const resetLink = `http://localhost:5006/reset-password.html?token=${user.resetToken}`;
      console.log("RESET LINK:", resetLink);
  
      // ✅ Send email here
      await sendResetEmail(user.username, resetLink); // <-- Add this line
      console.log("Sending email to:", user.username); // ← Check this in your logs
      res.json({ message: "Password reset initiated" });
    } catch (error) {
      console.error("ERROR in /forgot-password:", error);
      res.status(500).json({ message: "Error processing request" });
    }
  });
  
  // Password Reset Submission
router.post("/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
  
      const user = await User.findOne({ 
        resetToken: token,
        resetTokenExpires: { $gt: Date.now() } 
      });
  
      if (!user) return res.status(400).json({ message: "Invalid/expired token" });
  
      // Set raw password; middleware will hash it
      user.password = newPassword;
  
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
  
      await user.save(); // triggers pre('save') which hashes password
  
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("🔥 Reset password error:", error);
      res.status(500).json({ message: "Error resetting password" });
    }
  });
  
module.exports = router;
