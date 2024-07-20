const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

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

exports.loginUser = async (req, res) => {
  const { firstName, password } = req.body;

  try {
    const user = await User.findOne({ firstName });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

// Configure Multer for profile photo
const profilePhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile-photos/");
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + path.extname(file.originalname));
  },
});

const profilePhotoUpload = multer({
  storage: profilePhotoStorage,
  limits: { fileSize: 1024 * 1024 }, // 1 MB limit
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Images only!"));
    }
  },
}).single("profilePhoto");

exports.uploadProfilePhoto = async (req, res) => {
  profilePhotoUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const user = await User.findById(req.user.id);
      user.profilePhoto = req.file.path;
      await user.save();
      res.json({ message: "Profile photo uploaded successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error uploading profile photo" });
    }
  });
};
