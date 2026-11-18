let deleteId=null;
const rows=document.getElementById('rows');
function initials(name){return name==='Unassigned'?'—':name.split(' ').map(n=>n[0]).join('').slice(0,2)}
function statusClass(status){return status.toLowerCase().replaceAll(' ','-')}
function render(){
  const search=document.getElementById('search').value.toLowerCase();
  const status=document.getElementById('status').value;
  const severity=document.getElementById('severity').value;
  const assignee=document.getElementById('assignee').value;
  const filtered=bugs.filter(b=>(b.id.toLowerCase().includes(search)||b.title.toLowerCase().includes(search))&&(!status||b.status===status)&&(!severity||b.severity===severity)&&(!assignee||b.assignee===assignee));
  rows.innerHTML=filtered.length?filtered.map(b=>`<tr><td class="bug-id">${b.id}</td><td><strong>${b.title}</strong><small>${b.module}</small></td><td><span class="badge severity-${b.severity.toLowerCase()}">${b.severity}</span></td><td><span class="badge status ${statusClass(b.status)}">${b.status}</span></td><td><div class="assignee"><span class="avatar">${initials(b.assignee)}</span>${b.assignee}</div></td><td><strong class="reporter">${b.reporter}</strong><small>${b.date}</small></td><td><div class="actions"><button onclick="openBug('${b.id}')">View</button><button onclick="openBug('${b.id}')">Edit</button><a href="../bug-status/index.html?id=${b.id}">Update</a><button class="delete" onclick="askDelete('${b.id}')">Delete</button></div></td></tr>`).join(''):`<tr><td colspan="7"><div class="empty"><h3>No bugs found</h3><p>Try adjusting your search or filters.</p></div></td></tr>`;
  document.getElementById('footer').textContent=`Showing ${filtered.length} of ${bugs.length} bugs`;
}
function openBug(id){location.href=`../bug-status/index.html?id=${id}`}
function askDelete(id){deleteId=id;document.getElementById('deleteText').textContent=`${id} will be permanently removed.`;document.getElementById('modal').classList.remove('hidden')}
document.getElementById('search').addEventListener('input',render);
document.getElementById('status').addEventListener('change',render);
document.getElementById('severity').addEventListener('change',render);
document.getElementById('assignee').addEventListener('change',render);
document.getElementById('clear').onclick=()=>{document.querySelectorAll('.toolbar input,.toolbar select').forEach(el=>el.value='');render()};
document.getElementById('cancel').onclick=()=>document.getElementById('modal').classList.add('hidden');
document.getElementById('confirm').onclick=()=>{const index=bugs.findIndex(b=>b.id===deleteId);if(index>-1)bugs.splice(index,1);document.getElementById('modal').classList.add('hidden');render()};
render();