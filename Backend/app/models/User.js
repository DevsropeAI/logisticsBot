const db = require("./db");

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      (err, result) => {
        if (err) reject(err);
        resolve(result[0]);
      }
    );
  });
};

exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, result) => {
        if (err) reject(err);
        resolve(result[0]);
      }
    );
  });
};

exports.getAllNonAdminUsers = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, name, email, phone, created_at FROM users WHERE role != 'admin' ORDER BY created_at DESC",
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};