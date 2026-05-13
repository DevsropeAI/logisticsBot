const prisma = require("./db");

exports.saveMessage = async ({
  session_id,
  role,
  message,
}) => {
  return await prisma.chatHistory.create({
    data: {
      sessionId: session_id,
      role,
      message
    }
  });
};

exports.getMessages = async (session_id) => {
  return await prisma.chatHistory.findMany({
    where: { sessionId: session_id },
    orderBy: { id: 'asc' },
    take: 10,
    select: { role: true, message: true }
  });
};

exports.deleteBySession = (session_id) => {

  return new Promise((resolve, reject) => {

    db.query(
      `
      DELETE FROM chat_history
      WHERE session_id = ?
      `,
      [session_id],
      (err, result) => {

        if (err) reject(err);

        resolve(result);

      }
    );

  });

};