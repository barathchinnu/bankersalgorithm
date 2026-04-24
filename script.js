let n = 5;
let m = 3;

/* ===========================
   RESOURCE LABELS
=========================== */

function resLabel(i){
  return String.fromCharCode(65+i);
}

function resLabels(){
  return Array.from(
    {length:m},
    (_,i)=>resLabel(i)
  );
}

/* ===========================
   STEP NAVIGATION
=========================== */

function goStep(step){

document
.querySelectorAll(".panel")
.forEach(p=>p.classList.remove("active"));

document
.getElementById(`panel-${step}`)
.classList.add("active");

document
.querySelectorAll(".step-item")
.forEach((el,i)=>{

el.classList.remove("active");

if(i+1===step)
el.classList.add("active");

});

}

/* ===========================
   BUILD TOTAL RESOURCES
=========================== */

function rebuildTotals(){

n=parseInt(
document.getElementById("cfg-n").value
);

m=parseInt(
document.getElementById("cfg-m").value
);

const container=
document.getElementById(
"total-res-row"
);

container.innerHTML=
resLabels()
.map((r,i)=>

`<div class="resource-field">

<span class="resource-label">
Total ${r}
</span>

<input type="number"
class="resource-input"
id="tot-${i}"
value="10">

</div>`

).join("");

}

/* ===========================
   BUILD MATRICES
=========================== */

function buildMatrices(){

n=parseInt(
document.getElementById("cfg-n").value
);

m=parseInt(
document.getElementById("cfg-m").value
);

/* AVAILABLE INPUTS */

const availDiv=
document.getElementById("avail-row");

availDiv.innerHTML=
resLabels()
.map((r,i)=>

`<div class="resource-field">

<span class="resource-label">
Avail ${r}
</span>

<input type="number"
class="resource-input"
id="avail-${i}"
placeholder="Auto">

</div>`

).join("");

makeTable("alloc-table","a");
makeTable("max-table","mx");

updateNeed();

goStep(2);

}

/* ===========================
   CREATE TABLE
=========================== */

function makeTable(id,prefix){

const table=
document.getElementById(id);

let html=
"<tr><th>Process</th>";

for(let j=0;j<m;j++)
html+=`<th>R${j}</th>`;

html+="</tr>";

for(let i=0;i<n;i++){

html+=`<tr><td>P${i}</td>`;

for(let j=0;j<m;j++){

html+=`<td>

<input type="number"
class="matrix-input"
id="${prefix}-${i}-${j}"
value="0"
oninput="updateNeed()">

</td>`;

}

html+="</tr>";

}

table.innerHTML=html;

}

/* ===========================
   UPDATE NEED MATRIX
=========================== */

function updateNeed(){

let html="<tr><th>Process</th>";

for(let j=0;j<m;j++)
html+=`<th>R${j}</th>`;

html+="</tr>";

for(let i=0;i<n;i++){

html+=`<tr><td>P${i}</td>`;

for(let j=0;j<m;j++){

let a=parseInt(
document
.getElementById(`a-${i}-${j}`)
?.value || 0
);

let mx=parseInt(
document
.getElementById(`mx-${i}-${j}`)
?.value || 0
);

let need=mx-a;

html+=`<td>${need}</td>`;

}

html+="</tr>";

}

document
.getElementById("need-table")
.innerHTML=html;

}

/* ===========================
   SAFETY ALGORITHM
=========================== */

function runSafety(){

let alloc=[];
let max=[];
let need=[];
let total=[];
let avail=[];

/* READ TOTAL */

for(let j=0;j<m;j++){

total[j]=parseInt(
document
.getElementById(`tot-${j}`)
.value || 0
);

}

/* READ MATRICES */

for(let i=0;i<n;i++){

alloc[i]=[];
max[i]=[];
need[i]=[];

for(let j=0;j<m;j++){

alloc[i][j]=parseInt(
document
.getElementById(`a-${i}-${j}`)
.value || 0
);

max[i][j]=parseInt(
document
.getElementById(`mx-${i}-${j}`)
.value || 0
);

need[i][j]=
max[i][j]-alloc[i][j];

}

}

/* CALCULATE AVAILABLE */

for(let j=0;j<m;j++){

let inputVal=
document
.getElementById(`avail-${j}`)
.value;

/* USER ENTERED */

if(inputVal !== ""){

avail[j]=parseInt(inputVal);

}

/* AUTO CALCULATE */

else{

let sumAlloc=0;

for(let i=0;i<n;i++){

sumAlloc+=alloc[i][j];

}

avail[j]=
total[j]-sumAlloc;

/* SHOW VALUE */

document
.getElementById(`avail-${j}`)
.value=avail[j];

}

}

/* BANKER'S LOGIC */

let finish=new Array(n)
.fill(false);

let safeSeq=[];

for(let k=0;k<n;k++){

for(let i=0;i<n;i++){

if(!finish[i]){

let possible=true;

for(let j=0;j<m;j++){

if(need[i][j] > avail[j]){

possible=false;
break;

}

}

if(possible){

for(let j=0;j<m;j++){

avail[j]+=alloc[i][j];

}

finish[i]=true;

safeSeq.push(i);

}

}

}

}

/* CHECK SAFE */

let safe=
finish.every(v=>v);

/* RESULT */

let resultDiv=
document.getElementById(
"result-container"
);

if(safe){

resultDiv.innerHTML=

`<h2 style="color:green">
✔ SAFE STATE
</h2>

<p>
Safe Sequence:
${safeSeq.map(p=>"P"+p).join(" → ")}
</p>`;

}

else{

resultDiv.innerHTML=

`<h2 style="color:red">
✖ UNSAFE STATE
</h2>

<p>
Deadlock possible — No safe sequence.
</p>`;

}

goStep(3);

}

/* ===========================
   INIT FIX
=========================== */

document.addEventListener("DOMContentLoaded", () => {

rebuildTotals();

/* When process changes */

document
.getElementById("cfg-n")
.addEventListener("input", rebuildTotals);

/* When resource changes */

document
.getElementById("cfg-m")
.addEventListener("input", rebuildTotals);

});