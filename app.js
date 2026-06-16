const API_URL =
"https://SCRIPT_WEBAPP_ANDA/exec";

let tipe = "";
let kode = "";
let item = {};
let userName = "";
let scanner = null;

function mulai(){

userName =
document
.getElementById("userName")
.value
.trim();

if(!userName){

```
alert("Masukkan Nama");

return;
```

}

document
.getElementById("login")
.style.display = "none";

document
.getElementById("menu")
.style.display = "block";

}

async function api(data){

const res =
await fetch(
API_URL,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
}
);

return await res.json();

}

async function pilih(t){

tipe = t;

document
.getElementById("menu")
.style.display = "none";

document
.getElementById("scanner")
.style.display = "block";

document
.getElementById("judulScan")
.innerHTML =
t === "IN"
? "Scan Barang Masuk"
: "Scan Barang Keluar";

scanner =
new Html5Qrcode("reader");

const cameras =
await Html5Qrcode.getCameras();

if(cameras.length === 0){

```
alert("Kamera tidak ditemukan");

return;
```

}

let cameraId =
cameras[cameras.length - 1].id;

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

  item =
  await api({

    action:"getItem",

    kode:kode

  });

  if(!item.found){

    alert("Barang tidak ditemukan");

    location.reload();

    return;

  }

  document
  .getElementById("scanner")
  .style.display = "none";

  document
  .getElementById("form")
  .style.display = "block";

  document
  .getElementById("nama")
  .innerHTML =
  item.nama;

  document
  .getElementById("kategori")
  .innerHTML =
  "Kategori : " +
  item.kategori;

  document
  .getElementById("stok")
  .innerHTML =
  "Stok Saat Ini : " +
  item.stok;

}
```

);

}

async function simpan(){

const qty =
document
.getElementById("qty")
.value;

const keterangan =
document
.getElementById("keterangan")
.value;

if(!qty){

```
alert("Masukkan Qty");

return;
```

}

const result =
await api({

```
action:"save",

kode:kode,

nama:item.nama,

kategori:item.kategori,

qty:qty,

pic:userName,

tipe:tipe,

keterangan:keterangan
```

});

if(result.success){

```
alert(
  "Berhasil disimpan\n" +
  "Stok sekarang : " +
  result.stokBaru
);

location.reload();
```

}else{

```
alert("Gagal menyimpan");
```

}

}
