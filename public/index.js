document.addEventListener("DOMContentLoaded", () => {
  const age = document.getElementById("age");
  const patientId = document.getElementById("patientId");
  const patientName = document.getElementById("patientName");
  const searchResult = document.getElementById("searchResult");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");

  age.innerHTML = `<option value="">Select</option>`;
  for (let i = 1; i <= 100; i++) {
    age.innerHTML += `<option>${i}</option>`;
  }

  const editPatient = localStorage.getItem("editPatient");
  if (editPatient) {
    const p = JSON.parse(editPatient);
    patientId.value = p.id; // ID cannot be changed
    patientId.disabled = true; // prevent user from editing ID
    patientName.value = p.name;
    age.value = p.age;
    document.querySelector("[name=dob]").value = p.dob;
    document.querySelector("[name=sex]").value = p.sex;
    document.querySelector("[name=weight]").value = p.weight;
    document.querySelector("[name=observation]").value = p.observation;
    document.querySelector("[name=diagnosis]").value = p.diagnosis;

    localStorage.removeItem("editPatient");
  }

  document.getElementById("addForm").addEventListener("submit", e => {
    e.preventDefault();

    const data = {
      id: patientId.value.trim(),
      name: patientName.value,
      age: age.value,
      dob: document.querySelector("[name=dob]").value,
      sex: document.querySelector("[name=sex]").value,
      weight: document.querySelector("[name=weight]").value,
      observation: document.querySelector("[name=observation]").value,
      diagnosis: document.querySelector("[name=diagnosis]").value
    };

    fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(d => {
      alert(d.message);
      document.getElementById("addForm").reset(); // clear form
      patientId.disabled = false; // re-enable ID input
    })
    .catch(err => alert("Error saving patient"));
  });

  // Search patient
  document.getElementById("searchform").addEventListener("submit", e => {
    e.preventDefault();
    fetch("/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: e.target.id.value })
    })
    .then(r => r.json())
    .then(d => {
      if (d.status === "found") {
        const p = d.patient;
        searchResult.innerHTML = `
          <p><b>ID:</b> ${p.id}</p>
          <p><b>Name:</b> ${p.name}</p>
          <p><b>Age:</b> ${p.age}</p>
          <p><b>Sex:</b> ${p.sex}</p>
          <p><b>DOB:</b> ${new Date(p.dob).toLocaleDateString()}</p>
          <p><b>Weight:</b> ${p.weight}</p>
          <p><b>Observation:</b> ${p.observation}</p>
          <p><b>Diagnosis:</b> ${p.diagnosis}</p>
        `;
      } else {
        searchResult.innerHTML = "<b>Patient not found</b>";
      }
    });
  });

  // Print report
  downloadPdfBtn.onclick = () => {
    if (!searchResult.innerText.trim()) return alert("Search patient first");
    const w = window.open("");
    w.document.write(`<pre>${searchResult.innerText}</pre>`);
    w.print();
  };
});
