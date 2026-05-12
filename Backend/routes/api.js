const express = require("express");
const router = express.Router();
const ChatController = require("../app/controllers/ChatController");
const AuthController = require("../app/controllers/AuthController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Chat routes
router.post("/chat",  ChatController.chat);

// Auth routes
router.post("/auth/login", AuthController.login);
router.get("/users", authMiddleware, AuthController.getAllUsers);
router.get("/orders", authMiddleware, AuthController.getAllOrders);
router.get("/complaints", authMiddleware, AuthController.getAllComplaints);
router.get("/dashboard/stats", authMiddleware, AuthController.getDashboardStats);
module.exports = router;