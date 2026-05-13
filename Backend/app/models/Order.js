const prisma = require("./db");

exports.getAllOrders = async () => {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      },
      tracking: {
        select: {
          location: true,
          eta: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return orders.map(order => ({
    id: order.id,
    order_number: order.orderNumber,
    status: order.status,
    created_at: order.createdAt,
    user_name: order.user?.name,
    user_email: order.user?.email,
    user_phone: order.user?.phone,
    tracking_location: order.tracking?.location,
    tracking_eta: order.tracking?.eta
  }));
};

exports.getOrderWithTracking = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId) },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      },
      tracking: {
        select: {
          location: true,
          eta: true
        }
      }
    }
  });

  if (!order) return null;

  return {
    id: order.id,
    order_number: order.orderNumber,
    status: order.status,
    created_at: order.createdAt,
    user_name: order.user?.name,
    user_email: order.user?.email,
    user_phone: order.user?.phone,
    tracking_location: order.tracking?.location,
    tracking_eta: order.tracking?.eta
  };
};

exports.findByOrderNumber = async (orderNumber) => {
  return await prisma.order.findUnique({
    where: { orderNumber }
  });
};
