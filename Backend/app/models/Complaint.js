const db = require("./db");

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