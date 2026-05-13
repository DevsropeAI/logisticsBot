const prisma = require("./db");

exports.getAllComplaints = async () => {
  const complaints = await prisma.complaint.findMany({
    select: {
      id: true,
      orderId: true,
      issueType: true,
      message: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      },
      order: {
        select: {
          orderNumber: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return complaints.map(complaint => ({
    id: complaint.id,
    order_id: complaint.orderId,
    issue_type: complaint.issueType,
    message: complaint.message,
    status: complaint.status,
    created_at: complaint.createdAt,
    user_name: complaint.user?.name,
    user_email: complaint.user?.email,
    user_phone: complaint.user?.phone,
    order_number: complaint.order?.orderNumber
  }));
};

exports.createComplaint = async ({
  order_id,
  user_id,
  issue_type,
  message,
}) => {
  return await prisma.complaint.create({
    data: {
      orderId: parseInt(order_id),
      userId: parseInt(user_id),
      issueType: issue_type,
      message
    }
  });
};