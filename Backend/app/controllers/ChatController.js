const ChatService = require("../services/ChatService");
const Pipeline = require("../pipelines/MessagePipeline");

class ChatController {
  static async chat(req, res) {
    const message = req.body.message;
    const sessionId = req.body.sessionId;
    // pipeline process
    const processed = Pipeline.process(message);

    // service logic
    const reply = await ChatService.handle(processed, message, sessionId);

    res.json({ reply });
  }
}

module.exports = ChatController;