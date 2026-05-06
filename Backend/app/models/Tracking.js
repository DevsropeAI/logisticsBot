const db = require("./db");

exports.getTrackingByOrderId = (orderId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM tracking WHERE order_id = ?",
      [orderId],
      (err, result) => {
        if (err) reject(err);
        resolve(result[0]);
      }
    );
  });
};