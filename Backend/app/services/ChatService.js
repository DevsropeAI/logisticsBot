const Order = require("../models/Order");
const Tracking = require("../models/Tracking");
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const ChatHistory = require("../models/ChatHistory");

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: '',
});

// ============================
// COMPANY POLICIES
// ============================

const policies = {
  return_days: 7,
  refund_allowed: true,
  exchange_allowed: true,
};
// ============================
// HELPER
// ============================
function isReturnEligible(deliveryDate) {
  if (!deliveryDate) {
    return false;
  }
  const today = new Date();
  const delivered = new Date(deliveryDate);
  const diffDays = Math.floor(
    (today - delivered) /
    (1000 * 60 * 60 * 24)
  );

  return diffDays <= policies.return_days;
}

class ChatService {

  static async handle(data, userMessage, sessionId) {
    try {
      // ============================
      // SAVE USER MESSAGE
      // ============================
      // console.log("Saving user message to chat history...", data);
      await ChatHistory.saveMessage({
        session_id: sessionId,
        role: "user",
        message: userMessage,
      });

      // ============================
      // LOAD CHAT HISTORY
      // ============================

      const history =
        await ChatHistory.getMessages(
          sessionId
        );

      // ============================
      // SYSTEM PROMPT
      // ============================

      const messages = [

        {
          role: "system",

          content: `
            You are a professional logistics customer support assistant.

            Your job:
            - Order tracking
            - Refund support
            - Exchange support
            - Complaint handling
            - General customer support

            Company Policies:
            - Orders are delivered within 7 days
            - Customers can return products within 7 days after delivery
            - Refunds are allowed
            - Exchanges are allowed

            Rules:
            - Reply like a real human
            - Be friendly
            - Be professional
            - Keep answers short and clear
            - Ask for order number if required
            `,
        },

      ];

      // ============================
      // ADD CHAT HISTORY
      // ============================

      history.forEach((item) => {

        messages.push({
          role: item.role,
          content: item.message,
        });

      });

      // ============================
      // ORDER FLOW
      // ============================

      if (data.orderNumber) {

        // find order
        const order =
          await Order.findByOrderNumber(
            data.orderNumber
          );

        // order not found
        if (!order) {
          // console.log(
          //   "Order not found:",
          //   data.orderNumber
          // );
          messages.push({
            role: "system",
            content: `
              Order number ${data.orderNumber} was not found in database.
              Tell user politely.
            `,
          });

        }

        else {
          // console.log(
          //   "Order found:",
          //   data.orderNumber
          // );
          // tracking
          const tracking = await Tracking.getTrackingByOrderId(order.id);

          // user
          const user = await User.getUserById(order.user_id);

          // ============================
          // DETECT INTENT
          // ============================

          let intent = "general";

          const lowerMessage =
            userMessage.toLowerCase();
          console.log("user message:", userMessage);

          if (lowerMessage.includes("refund")) {
            intent = "refund";
          }
          else if (lowerMessage.includes("exchange")) {
            intent = "exchange";
          }
          else if (lowerMessage.includes("damaged") || lowerMessage.includes("broken")) {
            intent = "damaged_product";
          }

          else if (lowerMessage.includes("late")) {
            intent = "late_delivery";
          }

          // ============================
          // CREATE COMPLAINT
          // ============================
          console.log("Detected intent:", intent);
          const complaintIntents = [
            "refund",
            "exchange",
            "damaged_product",
            "late_delivery",
          ];

          let complaintCreated = false;

          if (complaintIntents.includes(intent)) {

            await Complaint.createComplaint({

              order_id: order.id,
              user_id: user.id,
              issue_type: intent,
              message: userMessage,

            });
            complaintCreated = true;
          }

          // ============================
          // RETURN ELIGIBILITY
          // ============================

          const eligible =isReturnEligible(tracking?.updated_at);

          // ============================
          // GIVE CONTEXT TO AI
          // ============================

          messages.push({

            role: "system",

            content: `
                Customer Information:
                - Name: ${user.name}
                - Phone: ${user.phone}

                Order Information:
                - Order Number: ${order.order_number}
                - Status: ${order.status}

                Tracking:
                - Current Location: ${tracking?.location}
                - ETA: ${tracking?.eta}

                Policies:
                - Return Eligible: ${eligible ? "YES" : "NO"}

                Detected Intent:
                ${intent}

                Complaint Created:
                ${complaintCreated ? "YES" : "NO"}

                If user asks about order,
                reply using this data.
            `,

          });

        }

      }

      // ============================
      // OPENAI RESPONSE
      // ============================

      const aiResponse =
        await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: messages,
          temperature: 0.7,
        });

      const reply =aiResponse.choices[0].message.content;

      // ============================
      // SAVE AI RESPONSE
      // ============================

      await ChatHistory.saveMessage({
        session_id: sessionId,
        role: "assistant",
        message: reply,

      });

      return reply;

    }

    catch (error) {

      console.log(
        "ChatService Error:",
        error
      );

      return `
        ⚠️ Something went wrong.
        Please try again later.
      `;
    }

  }

}

module.exports = ChatService;