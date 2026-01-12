require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    age INT,
    sex VARCHAR(10),
    dob DATE,
    weight FLOAT,
    observation TEXT,
    diagnosis TEXT
);
`;

pool.query(createTableQuery, (err, result) => {
  if (err) {
    console.error("❌ Error creating table:", err.message);
  } else {
    console.log("✅ Table 'patients' created successfully!");
  }
  pool.end();
});
