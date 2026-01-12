require("dotenv").config();
const { Pool } = require("pg");

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: { rejectUnauthorized: false } // required for Render Postgres
});

db.connect(err => {
  if (err) {
    console.error("❌ PostgreSQL Connection Failed:", err.message);
  } else {
    console.log("✅ PostgreSQL Connected");
  }
});

module.exports = db;
