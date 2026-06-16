console.log("APP LOADED");

const API_URL =
"https://script.google.com/macros/s/AKfycbxPST92OLMC0MyQOwH5AleMbI4RPNb3DVCkzvWVGgZWji64hXBr4QEuSCUbmatbbtMltw/exec";

let tipe = "";
let kode = "";
let itemData = {};
let userName = "";

window.onerror = function(msg,url,line){

alert(
"ERROR : " +
msg +
"\nLine : " +
line
);

};

async function api(payload){

try{

```
const response = await fetch(
  API_URL,
  {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(payload)
  }
);

const text =
  await response.text();

console.log("API RESPONSE:", text);

return JSON.parse(text);
```

}catch(err){

```
alert(
  "Gagal koneksi ke Apps Script\n\n" +
  err.message
);

throw err;
```

}

}

function showMenu(){

userName =
document
.getElementById("userName")
.value
.trim();

if(userName === ""){

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

try{

```
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

if(cameras.length === 0){

  alert("Kamera tidak ditemukan");

  return;

}

let cameraId =
  cameras[cameras.length - 1].id;

await scanner.start(

  cameraId,

  {
    fps:10,
    qrbox:250
  },

  async function(decodedText){

    kode = decodedText;

    console.log(
      "BARCODE:",
      kode
    );

    await scanner.stop();

    const item =
      await api({

        action:"getItem",

        kode:kode

      });

    console.log(item);

    if(!item){

      alert(
        "Tidak ada respon dari server"
      );

      return;

    }

    if(!item.found){

      alert(
        "Barang tidak ditemukan"
      );

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

);
```

}catch(err){

```
alert(
  "Gagal membuka kamera\n\n" +
  err.message
);

console.error(err);
```

}

}

async function saveData(){

try{

```
const qty =
  document
    .getElementById("qty")
    .value;

const keterangan =
  document
    .getElementById("keterangan")
    .value;

if(!qty){

  alert(
    "Masukkan jumlah"
  );

  return;

}

const result =
  await api({

    action:"save",

    kode:kode,

    nama:itemData.nama,

    kategori:itemData.kategori,

    qty:qty,

    pic:userName,

    tipe:tipe,

    keterangan:keterangan

  });

if(result.success){

  alert(
    "Berhasil disimpan\n" +
    "Stok sekarang : " +
    result.stokBaru
  );

  location.reload();

}else{

  alert(
    result.error ||
    "Gagal menyimpan"
  );

}
```

}catch(err){

```
alert(
  "Gagal menyimpan\n\n" +
  err.message
);
```

}

}
