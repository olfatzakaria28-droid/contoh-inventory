alert("APP JS LOADED");
const API_URL =
"https://script.google.com/macros/s/AKfycbxPST92OLMC0MyQOwH5AleMbI4RPNb3DVCkzvWVGgZWji64hXBr4QEuSCUbmatbbtMltw/exec";

let tipe = "";
let kode = "";
let itemData = {};
let userName = "";

async function api(payload){

const response =
await fetch(API_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
});

const text =
await response.text();

return JSON.parse(text);

}

function showMenu(){

userName =
document.getElementById("userName").value;

if(!userName){

```
alert("Masukkan nama");

return;
```

}

document
.getElementById("stepUser")
.classList.add("hidden");

document
.getElementById("stepMenu")
.classList.remove("hidden");

}

async function startScan(type){

tipe = type;

document
.getElementById("stepMenu")
.classList.add("hidden");

document
.getElementById("stepScanner")
.classList.remove("hidden");

const scanner =
new Html5Qrcode("reader");

const cameras =
await Html5Qrcode.getCameras();

let cameraId =
cameras[cameras.length-1].id;

await scanner.start(

```
cameraId,

{
  fps:10,
  qrbox:250
},

async function(decodedText){

  kode = decodedText;

  await scanner.stop();

  const item =
    await api({

      action:"getItem",

      kode:kode

    });

  if(!item.found){

    alert("Barang tidak ditemukan");

    location.reload();

    return;

  }

  itemData = item;

  document
    .getElementById("stepScanner")
    .classList.add("hidden");

  document
    .getElementById("stepForm")
    .classList.remove("hidden");

  document
    .getElementById("namaBarang")
    .innerHTML =
      item.nama;

  document
    .getElementById("kategoriBarang")
    .innerHTML =
      "Kategori : " +
      item.kategori;

  document
    .getElementById("stokBarang")
    .innerHTML =
      "Stok Saat Ini : " +
      item.stok;

}
```

);

}

async function saveData(){

const qty =
document.getElementById("qty").value;

const keterangan =
document.getElementById("keterangan").value;

if(!qty){

```
alert("Masukkan jumlah");

return;
```

}

const result =
await api({

```
  action:"save",

  kode:kode,

  nama:itemData.nama,

  kategori:itemData.kategori,

  qty:qty,

  pic:userName,

  tipe:tipe,

  keterangan:keterangan

});
```

if(result.success){

```
alert(
  "Data berhasil disimpan\n" +
  "Stok sekarang : " +
  result.stokBaru
);

location.reload();
```

}else{

```
alert(
  result.error ||
  "Gagal menyimpan"
);
```

}

}
