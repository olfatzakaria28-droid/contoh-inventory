const URL_APPS_SCRIPT =
"https://script.google.com/macros/s/AKfycbx3kasZw7-VbVuoBwaf7eQNx0pgKZfO2UXqm2cCat0XStMLx2H3BohTmKCGZsVmzFr3jg/exec";

let tipe = "";
let kode = "";
let nama = "";
let kategori = "";

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

kode = code;

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
kode:kode
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

document.getElementById("scanner").style.display="none";
document.getElementById("form").style.display="block";

document.getElementById("nama").innerHTML =
data.nama;

}

async function simpan(){

  const qty =
  document.getElementById("qty").value;

  const pic =
  document.getElementById("pic").value;

  const departemen =
  document.getElementById("departemen").value;

  const keterangan =
  document.getElementById("keterangan").value;

  if(!qty){
    alert("Masukkan Qty");
    return;
  }

  if(!pic){
    alert("Masukkan Nama PIC");
    return;
  }

  if(!departemen){
    alert("Masukkan Departemen");
    return;
  }

  const res = await fetch(URL_APPS_SCRIPT,{
    method:"POST",
    body:JSON.stringify({
      action:"save",
      kode:kode,
      nama:nama,
      kategori:kategori,
      qty:qty,
      tipe:tipe,
      pic:pic,
      departemen:departemen,
      keterangan:keterangan
    })
  });

  const data = await res.json();

  alert(
    "Berhasil disimpan\nStok sekarang: "
    + data.stok
  );

  location.reload();

}
