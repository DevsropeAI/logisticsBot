const db = require("./db");

exports.getAllOrders = () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT o.id, o.order_number, o.status, o.created_at,
              u.name as user_name, u.email as user_email, u.phone as user_phone,
              t.location as tracking_location, t.eta as tracking_eta
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       LEFT JOIN tracking t ON o.id = t.order_id 
       ORDER BY o.created_at DESC`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

exports.getOrderWithTracking = (orderId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT o.id, o.order_number, o.status, o.created_at,
              u.name as user_name, u.email as user_email, u.phone as user_phone,
              t.location as tracking_location, t.eta as tracking_eta
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       LEFT JOIN tracking t ON o.id = t.order_id 
       WHERE o.id = ?`,
      [orderId],
      (err, result) => {
        if (err) reject(err);
        resolve(result[0]);
      }
    );
  });
};

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