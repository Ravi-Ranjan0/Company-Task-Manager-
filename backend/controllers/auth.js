// Import the required dependencies
const User = require("../models/User");
const sendEmail = require("../utils/nodemailer"); 
const jwt = require("jsonwebtoken");

// Controller function to send OTP (One Time Password) to the user's email
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Validate the email format
  if (!email || !email.includes("@")) {
    // If the email is invalid, respond with an error status and message
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {

    let user = await User.findOne({ email });
    if (!user) {
      // If the user doesn't exist, create a new user with the given email
      user = new User({ email });
    }

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save(); // Save the user data to the database

    await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("Error during OTP generation:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Controller function to verify the OTP entered by the user
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Error during OTP verification:", err);
    res.status(500).json({ message: "Server error" });
  }
};
