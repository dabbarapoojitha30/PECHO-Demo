document.addEventListener("DOMContentLoaded", () => {

  const age = document.getElementById("age");
  for(let i=1;i<=100;i++){
    age.innerHTML += `<option>${i}</option>`;
  }

  document.getElementById("addForm").addEventListener("submit", e => {
    e.preventDefault();

    const data = {
      id: patientId.value,
      name: patientName.value,
      age: age.value,
      dob: document.querySelector("[name=dob]").value,
      sex: document.querySelector("[name=sex]").value,
      weight: document.querySelector("[name=weight]").value,
      observation: document.querySelector("[name=observation]").value,
      diagnosis: document.querySelector("[name=diagnosis]").value
    };

    fetch("/add",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    })
    .then(r=>r.json())
    .then(d=>alert(d.message));
  });

  document.getElementById("searchform").addEventListener("submit", e => {
    e.preventDefault();
    fetch("/search",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({id:e.target.id.value})
    })
    .then(r=>r.json())
    .then(d=>{
      if(d.status==="found"){
        const p=d.patient;
        searchResult.innerHTML=`
          <p><b>ID:</b> ${p.id}</p>
          <p><b>Name:</b> ${p.name}</p>
          <p><b>Age:</b> ${p.age}</p>
          <p><b>Sex:</b> ${p.sex}</p>
          <p><b>DOB:</b> ${p.dob}</p>
          <p><b>Weight:</b> ${p.weight}</p>
          <p><b>Observation:</b> ${p.observation}</p>
          <p><b>Diagnosis:</b> ${p.diagnosis}</p>`;
      }else{
        searchResult.innerHTML="Not found";
      }
    });
  });

  downloadPdfBtn.onclick = () => {
    if(!searchResult.innerText) return alert("Search patient first");
    const w=window.open("");
    w.document.write(`<pre>${searchResult.innerText}</pre>`);
    w.print();
  };
});
