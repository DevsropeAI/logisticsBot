require("dotenv").config();
const Order = require("../models/Order");
const Tracking = require("../models/Tracking");
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const ChatHistory = require("../models/ChatHistory");

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: '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',
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

  static async handle(data, userMessage, sessionId, req) {
    try {

      const closeChatKeywords = [
        "bye",
        "goodbye",
        "end",
        "end chat",
        "close",
        "close chat",
        "exit",
        "quit",
        "stop",
        "stop chat",
        "finish",
        "finished",
        "done",
        "i am done",
        "thank you",
        "thanks",
        "ok thanks",
        "no thanks",
        "that's all",
        "thats all",
        "nothing else",
        "no more questions",
        "problem solved",
        "issue resolved",
        "resolved",
        "chat over",
        "terminate",
        "cancel chat",
        "leave chat",
        "see you",
        "talk later",
        "thankyou",
        "ok bye",
        "bye bye"
      ];

      const normalizedMessage = userMessage
        .toLowerCase()
        .trim();

      if (
        closeChatKeywords.some(keyword =>
          normalizedMessage.includes(keyword)
        )
      ) {
        await ChatHistory.deleteBySession(sessionId);

        req.session.orderId = null;

        req.session.destroy(() => {});

        return "Thank you 😊 Your chat has been ended.";
      }
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

        if (!req.session.orderId) {

          for (let i = history.length - 1; i >= 0; i--) {

            const text = history[i].message;

            const match = text.match(/(ORD\d+|\d{4,})/i);

            if (match) {
              req.session.orderId = match[0].toUpperCase();
              console.log(
                "Order ID loaded from history:",
                req.session.orderId
              );
              break;
            }
          }
        }

      // ============================
      // SYSTEM PROMPT
      // ============================

      const messages = [

        {
          role: "system",

          content: `
            You are a professional logistics customer support assistant.

            Your responsibilities:

            Order tracking
            Delivery updates
            Refund requests
            Return requests
            Exchange requests
            Cancellation requests
            Wrong or damaged product issues
            Complaint handling
            General customer support
            Orders are usually delivered within 7 days
            Returns are allowed within 7 days after delivery
            Refunds and exchanges are allowed according to policy
            Orders marked "Out For Delivery" usually cannot be canceled
            Customers may refuse delivery if unavailable
            Always use ONLY the order data provided by the system
            Never change or assume order status
            Never invent tracking details or policies
            If order status is "Pending", keep it Pending
            If order status is "Out For Delivery", keep it Out For Delivery
            Never contradict database information
            If the user previously provided an order number in chat history, remember that order number and use it for follow-up questions.
            If the order number is missing in the current user message:
            politely ask for it
            If a previously shared order number exists in chat history:
            do not ask again
            use that order number for the next requests
            If customer reports an issue:
            acknowledge the issue naturally
            If complaint/ticket is already created:
            confirm politely and do NOT ask again
            Never repeatedly ask:
            "Would you like to proceed?"
            Never repeat the same response again and again
            Continue conversation naturally using previous context
            If customer is frustrated:
            respond calmly and empathetically

            If customer reports:

            refund request
            exchange request
            cancellation
            return request
            wrong product
            damaged item
            delivery issue

            Then:

            acknowledge issue politely
            confirm support team will contact them
            avoid repetitive replies
            avoid looping conversation
            Short
            Human-like
            Friendly
            Professional
            Conversational

            GOOD EXAMPLES:

            "I understand your concern 😊"
            "I noted your request."
            "Our support team will contact you shortly."

            BAD EXAMPLES:

            Repeating the same response
            Asking for confirmation repeatedly
            Contradicting order status
            Sounding robotic

            Final instruction:
            Behave like a smart human support agent that remembers context and responds naturally.
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
      console.log("Session orderId is here:", req.session.orderId);
      // ============================
      // ORDER FLOW
      // ============================
      if (req.session.orderId) {
        console.log("Session orderId is here:", req.session.orderId);
        // find order
        const order =
          await Order.findByOrderNumber(
            req.session.orderId
          );

        // order not found
        if (!order) {
          
          messages.push({
            role: "system",
            content: `
              Order number ${req.session.orderId} was not found in database.
              Tell user politely.
            `,
          });

        }

        else {
          // tracking
          const tracking = await Tracking.getTrackingByOrderId(order.id);

          // user
          const user = await User.getUserById(order.user_id);

          // DETECT INTENT

          let intent = "general";

          const lowerMessage =
            userMessage.toLowerCase();
          console.log("user message intent:", lowerMessage);

          if (lowerMessage.includes("refund")) {
           intent = "refund_request";
          }
          else if (
            lowerMessage.includes("exchange") ||
            lowerMessage.includes("wrong product") ||
            lowerMessage.includes("wrong item")
          ) {
            intent = "exchange_request";
          }
          else if (lowerMessage.includes("return")) {
            intent = "return_request";
          }
          else if (lowerMessage.includes("cancel")) {
            intent = "cancel_order";
          }
          else if (
            lowerMessage.includes("damaged") ||
            lowerMessage.includes("broken")
          ) {
            intent = "damaged_product";
          }

          else if (lowerMessage.includes("late")) {
            intent = "late_delivery";
          }
          // CREATE COMPLAINT
          console.log("Detected intent:", intent);
          const complaintIntents = [
            "refund_request",
            "exchange_request",
            "return_request",
            "cancel_order",
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

            if (complaintCreated) { 
              // Pending orders 
             if (order.status === "Pending") 
              {
                 return ` I noted your ${intent.replace(/_/g, " ")} request 😊 Our support team will contact you shortly and help resolve your issue. Thank you for your patience. `; 
              } 
                 // Out for delivery 
              else if ( order.status === "Out For Delivery" ) { 
                return ` Your order is already out for delivery, so cancellation may not be possible now. You may refuse delivery if unavailable. Our support team will still review your request. `; 
              } 
              // Delivered 
              else if ( order.status === "Delivered" ) { 
                return ` I noted your request 😊 Our support team will contact you shortly and guide you regarding return or exchange options. `; 
              } 
            }
          }

          // RETURN ELIGIBILITY
          const eligible =isReturnEligible(tracking?.updated_at);

          // GIVE CONTEXT TO AI
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

                If user asks about order information then reply user with this data
            `,

          });

        }

      }
      // OPENAI RESPONSE
      const aiResponse =
        await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: messages,
          temperature: 0.7,
        });

      const reply =aiResponse.choices[0].message.content;
      // SAVE AI RESPONSE
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