const db = require("./db");

exports.getAllComplaints = () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT c.id, c.order_id, c.issue_type, c.message, c.status, c.created_at,
              u.name as user_name, u.email as user_email, u.phone as user_phone,
              o.order_number
       FROM complaints c 
       JOIN users u ON c.user_id = u.id 
       LEFT JOIN orders o ON c.order_id = o.id 
       ORDER BY c.created_at DESC`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

exports.createComplaint = ({
  order_id,
  user_id,
  issue_type,
  message,
}) => {
  return new Promise((resolve, reject) => {

    db.query(
      `
      INSERT INTO complaints
      (order_id, user_id, issue_type, message)
      VALUES (?, ?, ?, ?)
      `,
      [order_id, user_id, issue_type, message],
      (err, result) => {

        if (err) {
          reject(err);
        }

        resolve(result);
      }
    );

  });
};