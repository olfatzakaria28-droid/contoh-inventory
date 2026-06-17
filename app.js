const URL_APPS_SCRIPT =
"https://script.google.com/macros/s/AKfycbwYHTq10PSJso_S7D0KqCcQ4EnQyrlBC9p-uoSVlzeUQMQcd85YgqK8yku9pBIsRzf--A/exec";

let tipe = "";
let barcode = "";
let nama = "";

function showLoading(){

document.getElementById("loading").style.display =
"flex";

}

function hideLoading(){

document.getElementById("loading").style.display =
"none";

}

function pilih(t){

tipe = t;

document.getElementById("menu").style.display="none";
document.getElementById("scanner").style.display="block";

startScanner();

}

function startScanner(){

const html5QrCode =
new Html5Qrcode("reader");

html5QrCode.start(
{ facingMode: "environment" },
{
fps:10,
qrbox:250
},
async(code)=>{

barcode = code;

await html5QrCode.stop();

cariBarang();

}
);

}

async function cariBarang(){

showLoading();

const res = await fetch(URL_APPS_SCRIPT,{
method:"POST",
body:JSON.stringify({
action:"getItem",
barcode:barcode
})
});

const data = await res.json();

hideLoading();

if(!data.found){

alert("Barang tidak ditemukan");

location.reload();

return;

}

nama = data.nama;

document.getElementById("scanner").style.display="none";
document.getElementById("form").style.display="block";

document.getElementById("nama").innerHTML =
data.nama;

}

async function simpan(){

showLoading();

const qty =
document.getElementById("qty").value;

const res = await fetch(URL_APPS_SCRIPT,{
method:"POST",
body:JSON.stringify({
action:"save",
barcode:barcode,
nama:nama,
qty:qty,
tipe:tipe
})
});

const data = await res.json();

hideLoading();

alert(
"Berhasil disimpan\nStok sekarang: "
+ data.stok
);

location.reload();

}
