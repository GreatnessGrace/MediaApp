const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/upload-profile-photo", userController.uploadProfilePhoto);
router.post("/upload-video", userController.uploadVideo);
router.get("/user-videos/:id", userController.getUserVideos);
router.get("/all-users", userController.getAllUsers);

module.exports = router;
