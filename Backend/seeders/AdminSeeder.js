const bcrypt = require("bcryptjs");
const db = require("../app/models/db");

async function runSeeder() {

  try {

    // 🔒 Password Hash
    const hashedPassword =
      await bcrypt.hash("admin", 10);

    // 📌 Check if admin already exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      ["admin@example.com"],
      (err, result) => {

        if (err) {
          console.log(err);
          return;
        }

        // already exists
        if (result.length > 0) {
          console.log("Admin already exists");
          return;
        }

        // insert admin
        db.query(
          `
          INSERT INTO users
          (name, email, phone, password, role)
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            "Admin",
            "admin@example.com",
            null,
            hashedPassword,
            'admin'
          ],
          (err, result) => {

            if (err) {
              console.log(err);
              return;
            }

            console.log("✅ Admin Seeder Run Successfully");

            process.exit();
          }
        );

      }
    );

  }

  catch (error) {

    console.log(error);

  }

}

runSeeder();