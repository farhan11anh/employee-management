# 🧑‍💼 Employee Management App - Angular

Aplikasi manajemen karyawan berbasis **Angular** dengan tampilan modern menggunakan **Angular Material**, **NG-ZORRO**, dan notifikasi dari **ngx-toastr**.

---

## ✨ Fitur

- ✅ Login dengan hardcoded credentials
- ✅ Filter, search, sorting, dan pagination
- ✅ Lihat **detail karyawan** dengan klik pada nama di tabel
- ✅ CRUD: Tambah, edit, hapus data karyawan
- ✅ Validasi form saat tambah/edit:
  - ✉️ Email harus valid
  - 📆 Tanggal lahir minimal usia 18 tahun
  - 👤 Username minimal 3 karakter
- ✅ Format data seperti tanggal lahir & gaji (Rp)
- ✅ Penyimpanan data **persisten** di **LocalStorage**
- ✅ Responsif dengan horizontal scroll di perangkat mobile
- ✅ Query params tersimpan di URL (bisa dishare/bookmark)

---

## 🔐 Login

Gunakan kredensial berikut untuk login ke aplikasi:

```
Email    : admin@example.com  
Password : admin123
```


---

## 📋 Cara Penggunaan

### 📌 Melihat Detail Karyawan
Klik **nama karyawan** pada kolom tabel untuk membuka halaman detail lengkap.

### ➕ Menambah Karyawan
1. Klik tombol **"Add Employee"** di atas tabel.
2. Isi form dengan data valid:
   - Email format valid
   - Tanggal lahir tidak boleh di bawah usia 18 tahun
   - Username minimal 3 karakter
3. Tombol **Save** hanya aktif jika seluruh input valid.

### ✏️ Mengedit Karyawan
1. Pada kolom **Actions**, klik ikon **✎ edit** pada baris karyawan yang ingin diubah.
2. Ubah data sesuai kebutuhan.
3. Validasi sama seperti saat tambah data.

### 🗑️ Menghapus Karyawan
Klik ikon **🗑️ delete** pada kolom **Actions**. Konfirmasi akan muncul sebelum data dihapus.

---

## 📁 Penyimpanan Data

Data karyawan disimpan menggunakan **LocalStorage** browser. Artinya:

- Data **tidak hilang saat refresh** atau menutup browser.
- Akan hilang hanya jika user menghapus LocalStorage secara manual.
- Cocok untuk demo/simulasi tanpa backend.

---

## 🥉 Dependencies

- [Angular Material](https://material.angular.io/)
- [NG-ZORRO](https://ng.ant.design/docs/introduce/en)
- [ngx-toastr](https://www.npmjs.com/package/ngx-toastr)

---

## ⚙️ Instalasi

```bash
git clone https://github.com/username/employee-management-angular.git
cd employee-management-angular
npm install
ng serve


