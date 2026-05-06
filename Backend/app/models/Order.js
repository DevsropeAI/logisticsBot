const db = require("./db");

exports.findByOrderNumber = (orderNumber) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM orders WHERE order_number = ?",
      [orderNumber],
      (err, result) => {
        if (err) reject(err);
        resolve(result[0]);
      }
    );
  });
};