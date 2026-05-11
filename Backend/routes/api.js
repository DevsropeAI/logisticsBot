const express = require("express");
const router = express.Router();
const ChatController = require("../app/controllers/ChatController");
const AuthController = require("../app/controllers/AuthController");

// Chat routes
router.post("/chat", ChatController.chat);

// Auth routes
router.post("/auth/login", AuthController.login);

module.exports = router;