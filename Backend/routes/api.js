const express = require("express");
const router = express.Router();
const ChatController = require("../app/controllers/ChatController");

router.post("/chat", ChatController.chat);

module.exports = router;