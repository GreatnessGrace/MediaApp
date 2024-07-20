const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/upload-profile-photo", userController.uploadProfilePhoto);
router.post("/upload-video", userController.uploadVideo);

module.exports = router;
