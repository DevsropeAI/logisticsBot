const db = require("./db");

exports.saveMessage = ({
  session_id,
  role,
  message,
}) => {

  return new Promise((resolve, reject) => {

    db.query(
      `
      INSERT INTO chat_history
      (session_id, role, message)
      VALUES (?, ?, ?)
      `,
      [session_id, role, message],
      (err, result) => {

        if (err) reject(err);

        resolve(result);

      }
    );

  });

};

exports.getMessages = (session_id) => {

  return new Promise((resolve, reject) => {

    db.query(
      `
      SELECT role, message
      FROM chat_history
      WHERE session_id = ?
      ORDER BY id ASC
      LIMIT 10
      `,
      [session_id],
      (err, result) => {

        if (err) reject(err);

        resolve(result);

      }
    );

  });

};

