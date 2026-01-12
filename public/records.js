fetch("/all")
.then(r=>r.json())
.then(d=>{
  records.innerHTML=d.map(p=>`
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.age}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="del('${p.id}')">
          Delete
        </button>
      </td>
    </tr>`).join("");
});

function del(id){
  if(confirm("Delete record?")){
    fetch("/delete/"+id,{method:"DELETE"}).then(()=>location.reload());
  }
}
