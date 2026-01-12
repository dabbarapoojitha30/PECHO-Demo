require("dotenv").config();
const express=require("express");
const db=require("./db");
const app=express();

app.use(express.json());
app.use(express.static("public"));

app.post("/add",(req,res)=>{
  const p=req.body;
  db.query(
    "REPLACE INTO patients VALUES (?,?,?,?,?,?,?,?)",
    [p.id,p.name,p.age,p.sex,p.dob,p.weight,p.observation,p.diagnosis],
    ()=>res.json({message:"Saved Successfully"})
  );
});

app.post("/search",(req,res)=>{
  db.query(
    "SELECT * FROM patients WHERE id=?",
    [req.body.id],
    (e,r)=>{
      if(r.length) res.json({status:"found",patient:r[0]});
      else res.json({status:"notfound"});
    }
  );
});

app.get("/all",(req,res)=>{
  db.query("SELECT * FROM patients",(e,r)=>res.json(r));
});

app.delete("/delete/:id",(req,res)=>{
  db.query("DELETE FROM patients WHERE id=?",[req.params.id],()=>res.json({}));
});

app.listen(3000,()=>console.log("Server running on 3000"));
