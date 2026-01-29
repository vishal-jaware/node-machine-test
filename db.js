const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", 
  database: "machine_test"
});

db.connect(err => {
  if (err) {
    console.error("DB connection error:", err.message);
    return;
  }
  console.log("MySQL Connected");
});

module.exports = db;
