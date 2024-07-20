const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Helper function to generate random password
const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.createUser = async (req, res) => {
  const { firstName, lastName, email, number } = req.body;
  const password = generatePassword();

  const user = new User({
    firstName,
    lastName,
    email,
    number,
    password,
  });

  try {
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to the Application",
      text: `Hi ${firstName} ${lastName}, welcome to the application. This is your password: ${password}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: "Error sending email" });
      }
      res.status(201).json({ message: "User created successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};
