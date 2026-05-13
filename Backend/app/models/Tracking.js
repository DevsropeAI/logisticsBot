const prisma = require("./db");

exports.getTrackingByOrderId = async (orderId) => {
  return await prisma.tracking.findUnique({
    where: { orderId: parseInt(orderId) }
  });
};