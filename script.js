let n = 5;
let m = 3;

/* Labels */

function resLabel(i){
return String.fromCharCode(65+i);
}

function resLabels(){
return Array.from(
{length:m},
(_,i)=>resLabel(i)
);
}

/* Step navigation */

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

/* Step 1 */

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
${r}
</span>

<input type="number"
class="resource-input"
id="tot-${i}"
value="5">

</div>`

).join("");

}

/* Step 2 */

function buildMatrices(){

rebuildTotals();

const rl=resLabels();

const availDiv=
document.getElementById(
"avail-row"
);

availDiv.innerHTML=
rl.map((r,i)=>

`<div class="resource-field">

<span class="resource-label">
${r}
</span>

<input type="number"
class="resource-input"
id="avail-${i}"
value="3">

</div>`

).join("");

makeTable("alloc-table","a");
makeTable("max-table","mx");

updateNeed();

goStep(2);

}

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

/* Need matrix */

function updateNeed(){

const rl=resLabels();

let html=
"<tr><th>Process</th>";

rl.forEach(r=>{
html+=`<th>${r}</th>`;
});

html+="</tr>";

for(let i=0;i<n;i++){

html+=`<tr><td>P${i}</td>`;

for(let j=0;j<m;j++){

let a=parseInt(
document
.getElementById(`a-${i}-${j}`)
?.value||0
);

let mx=parseInt(
document
.getElementById(`mx-${i}-${j}`)
?.value||0
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

/* Safety Algorithm */

function runSafety(){

const rl=resLabels();

let avail=[];
let alloc=[];
let max=[];
let need=[];

for(let j=0;j<m;j++){

avail[j]=parseInt(
document
.getElementById(`avail-${j}`)
.value
);

}

for(let i=0;i<n;i++){

alloc[i]=[];
max[i]=[];
need[i]=[];

for(let j=0;j<m;j++){

alloc[i][j]=parseInt(
document
.getElementById(`a-${i}-${j}`)
.value
);

max[i][j]=parseInt(
document
.getElementById(`mx-${i}-${j}`)
.value
);

need[i][j]=
max[i][j]-alloc[i][j];

}

}

let finish=new Array(n)
.fill(false);

let safeSeq=[];

for(let k=0;k<n;k++){

for(let i=0;i<n;i++){

if(!finish[i]){

let possible=true;

for(let j=0;j<m;j++){

if(need[i][j]>avail[j]){

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

let safe=
finish.every(v=>v);

let resultDiv=
document.getElementById(
"result-container"
);

if(safe){

resultDiv.innerHTML=

`<h2 style="color:lightgreen">
SAFE STATE
</h2>

<p>
Sequence:
${safeSeq.map(p=>"P"+p).join(" → ")}
</p>`;

}

else{

resultDiv.innerHTML=

`<h2 style="color:red">
UNSAFE STATE
</h2>`;

}

goStep(3);

}

/* Init */

document.addEventListener(
"DOMContentLoaded",
rebuildTotals
);