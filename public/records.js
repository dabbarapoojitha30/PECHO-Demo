function loadRecords() {
  fetch("/all")
    .then(r => r.json())
    .then(d => {
      records.innerHTML = d.map(p => `
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.age}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="update('${p.id}')">Update</button>
          </td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="del('${p.id}')">Delete</button>
          </td>
        </tr>
      `).join("");
    });
}

loadRecords();


function del(id) {
  if (confirm("Delete record?")) {
    fetch("/delete/" + id, { method: "DELETE" })
      .then(() => loadRecords());
  }
}


function update(id) {
  fetch("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  })
  .then(r => r.json())
  .then(d => {
    if (d.status === "found") {
      // Save patient data in localStorage
      localStorage.setItem("editPatient", JSON.stringify(d.patient));
      // Redirect to main form
      window.location.href = "/";
    } else {
      alert("Patient not found");
    }
  });
}
