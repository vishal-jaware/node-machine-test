const mysql = require("mysql2");

const DATABASE_URL = process.env.DATABASE_URL?.trim();

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is empty or invalid");
  process.exit(1);
}

const db = mysql.createConnection(DATABASE_URL);

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ MySQL Connected");
});

console.log("DATABASE_URL:", process.env.DATABASE_URL);

module.exports = db;
