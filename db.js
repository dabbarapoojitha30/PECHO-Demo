// db.js
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // uses your URL from .env
  ssl: { rejectUnauthorized: false }         // required for Render
});

module.exports = pool;
