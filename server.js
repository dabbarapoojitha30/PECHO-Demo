require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/add", async (req, res) => {
  const p = req.body;

  try {
    const existing = await db.query("SELECT * FROM patients WHERE id=$1", [p.id]);

    if (existing.rows.length) {
  
      await db.query(
        `UPDATE patients SET name=$1, age=$2, sex=$3, dob=$4, weight=$5, observation=$6, diagnosis=$7 WHERE id=$8`,
        [p.name, p.age, p.sex, p.dob, p.weight, p.observation, p.diagnosis, p.id]
      );
      return res.json({ message: "Patient updated successfully" });
    }

    await db.query(
      `INSERT INTO patients (id,name,age,sex,dob,weight,observation,diagnosis)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [p.id, p.name, p.age, p.sex, p.dob, p.weight, p.observation, p.diagnosis]
    );

    res.json({ message: "Patient added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/search", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM patients WHERE id=$1", [req.body.id]);
    if (result.rows.length)
      res.json({ status: "found", patient: result.rows[0] });
    else
      res.json({ status: "notfound" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/all", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM patients ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


app.delete("/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM patients WHERE id=$1", [req.params.id]);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
