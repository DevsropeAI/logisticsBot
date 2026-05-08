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
            You are a professional AI logistics customer support assistant.

            Your job is to help customers naturally and professionally regarding:

            - Order tracking
            - Delivery updates
            - Delayed shipments
            - Refund requests
            - Return requests
            - Exchange requests
            - Damaged products
            - Wrong item received
            - Missing items
            - Cancellation requests
            - Address change requests
            - Delivery issues
            - Payment issues
            - Complaint handling
            - General customer support

            ===========================
            COMPANY POLICIES
            ===========================

            - Orders are normally delivered within 7 days
            - Customers can return products within 7 days after delivery
            - Refunds are allowed according to policy
            - Exchanges are allowed according to policy
            - Orders already "Out For Delivery" usually cannot be canceled
            - Customers may refuse delivery if unavailable
            - Damaged or wrong products are eligible for exchange/review
            - Escalate serious issues politely when needed

            ===========================
            YOUR BEHAVIOR
            ===========================

            - Reply like a real human support agent
            - Be friendly, professional, and empathetic
            - Keep responses short, natural, and conversational
            - Avoid robotic replies
            - Avoid repeating the same response again and again
            - Never copy-paste previous responses
            - Understand customer emotions and frustration
            - Continue the conversation naturally
            - Remember previous context from the conversation
            - If customer gives additional explanation, acknowledge it properly
            - Give alternative solutions when possible
            - Do not always ask the same question repeatedly
            - If order information is already available, do not ask for it again
            - If customer already shared order number earlier, remember it
            - If customer is angry or frustrated, respond calmly and politely
            - If customer explains a personal issue (busy, out of city, emergency),
              respond empathetically and suggest practical solutions
            - Never sound like a machine
            - Never respond with the exact same wording repeatedly

            ===========================
            IMPORTANT RULES
            ===========================

            - If user asks about an order and order number is missing,
              politely ask for the order number

            - If order status is "Out For Delivery":
              explain politely that cancellation may not be possible

            - If customer says they are unavailable or out of city:
              suggest alternatives like:
              - rescheduling delivery
              - refusing delivery
              - asking someone else to receive it

            - If customer repeatedly asks same issue:
              do NOT repeat same answer word-by-word
              instead continue conversation naturally

            - If customer asks for refund:
              check eligibility according to policy

            - If customer asks for exchange:
              guide them properly

            - If issue requires human support:
              politely inform customer that support team will review it

            - If complaint is created:
              confirm complaint politely

            - Always prioritize helpfulness and clarity

            ===========================
            TONE EXAMPLES
            ===========================

            GOOD:
            "I understand your concern 😊"

            GOOD:
            "Sorry for the inconvenience."

            GOOD:
            "Let me check that for you."

            GOOD:
            "Since you're unavailable, we can try rescheduling delivery."

            BAD:
            Repeating same sentence again and again

            BAD:
            Sounding robotic

            BAD:
            Ignoring previous conversation context

            IMPORTANT ISSUE HANDLING RULES:

            If customer reports an issue such as:

            refund
            exchange
            wrong product
            damaged item
            cancellation
            return request
            delivery issue

            Then:

            acknowledge issue naturally
            confirm issue has been noted
            inform customer support team will contact them
            do NOT repeatedly ask for confirmation
            do NOT repeat same response
            do NOT loop conversation

            Examples:

            GOOD:
            "I noted your issue 😊
            Our support team will contact you shortly."

            BAD:
            "Would you like to proceed?"
            repeated again and again

            ===========================
            FINAL INSTRUCTION
            ===========================

            Behave exactly like a smart, experienced human logistics support agent with memory and conversational understanding.
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
          console.log("user message intent:", lowerMessage);

          if (
            lowerMessage.includes("refund")
          ) {

            intent = "refund_request";

          }

          else if (
            lowerMessage.includes("exchange") ||
            lowerMessage.includes("wrong product") ||
            lowerMessage.includes("wrong item")
          ) {

            intent = "exchange_request";

          }

          else if (
            lowerMessage.includes("return")
          ) {

            intent = "return_request";

          }

          else if (
            lowerMessage.includes("cancel")
          ) {

            intent = "cancel_order";

          }

          else if (
            lowerMessage.includes("damaged") ||
            lowerMessage.includes("broken")
          ) {

            intent = "damaged_product";

          }

          else if (
            lowerMessage.includes("late")
          ) {

            intent = "late_delivery";

          }

          // ============================
          // CREATE COMPLAINT
          // ============================
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

                If user asks about order information then reply user with this data
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