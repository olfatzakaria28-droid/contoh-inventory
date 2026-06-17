const URL_APPS_SCRIPT =
"https://script.google.com/macros/s/AKfycbyLNXsch_nOyHl4iF9vyOMFDm2z5VZSQv5segdWTqTADH6_eKrJ9l99vFMaAdtIxo-KmA/exec";

let tipe = "";
let barcode = "";
let nama = "";
let kategori = "";
let merk = "";
let stok = "";
let satuan = "";


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

const res = await fetch(URL_APPS_SCRIPT,{
method:"POST",
body:JSON.stringify({
action:"getItem",
barcode:barcode
})
});

const data = await res.json();

if(!data.found){

alert("Barang tidak ditemukan");

location.reload();

return;

}

nama = data.nama;
kategori = data.kategori;
merk = data.merk;
stok = data.stok;
satuan = data.satuan;

document.getElementById("scanner").style.display="none";
document.getElementById("form").style.display="block";

document.getElementById("nama").innerHTML =
data.nama;

document.getElementById("barcode").innerHTML =
"Barcode : " + data.barcode;

document.getElementById("kategori").innerHTML =
"Kategori : " + data.kategori;

document.getElementById("merk").innerHTML =
"Merk : " + data.merk;

document.getElementById("stok").innerHTML =
"Stok Saat Ini : " + data.stok;

document.getElementById("satuan").innerHTML =
"Satuan : " + data.satuan;


}

async function simpan(){

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

alert(
"Berhasil disimpan\nStok sekarang: "
+ data.stok
);

location.reload();

}
