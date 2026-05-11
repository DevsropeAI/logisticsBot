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