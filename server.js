require("dotenv").config();
const express = require("express");
const db = require("./db");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// Add or update patient
app.post("/add", (req, res) => {
  const p = req.body;
  db.query(
    `INSERT INTO patients (id,name,age,sex,dob,weight,observation,diagnosis)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (id)
     DO UPDATE SET name=$2, age=$3, sex=$4, dob=$5, weight=$6, observation=$7, diagnosis=$8`,
    [p.id, p.name, p.age, p.sex, p.dob, p.weight, p.observation, p.diagnosis],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Saved Successfully" });
    }
  );
});

// Search patient by ID
app.post("/search", (req, res) => {
  db.query(
    "SELECT * FROM patients WHERE id=$1",
    [req.body.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.rows.length) res.json({ status: "found", patient: result.rows[0] });
      else res.json({ status: "notfound" });
    }
  );
});

// Get all patients
app.get("/all", (req, res) => {
  db.query("SELECT * FROM patients", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result.rows);
  });
});

// Delete patient by ID
app.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM patients WHERE id=$1", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deleted Successfully" });
  });
});

// Use environment variable PORT for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
