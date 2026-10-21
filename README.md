# Sistem Informasi Manajemen Surat Masuk & Surat Keluar
## SD NEGERI KESILIR 02 — KECAMATAN WULUHAN, KABUPATEN JEMBER

Aplikasi web administrasi persuratan resmi berbasis **React + Vite**, terintegrasi penuh dengan **Google Cloud Firebase (Auth, Cloud Firestore, Cloud Storage)**, dan siap diunggah ke **GitHub** serta dideploy ke **Vercel**.

---

### 🏛️ Identitas Lembaga & Kop Resmi
- **Pemerintah**: PEMERINTAH KABUPATEN JEMBER
- **Dinas**: DINAS PENDIDIKAN
- **Satuan Pendidikan**: SEKOLAH DASAR NEGERI KESILIR 02
- **Kecamatan**: KECAMATAN WULUHAN
- **Alamat**: Jl. Kesilir No. 02, Desa Kesilir, Kec. Wuluhan, Kab. Jember, Jawa Timur

---

### 🚀 Fitur Utama Aplikasi
1. **Autentikasi Administrator Terproteksi**:
   - Berbasis Firebase Authentication dengan verifikasi role admin di Firestore (`/admins/{uid}`).
   - Mendukung username `admin` (otomatis dipetakan secara aman ke domain administratif).
   - Dilengkapi modul *Bootstrap Admin Perdana* saat pertama kali dipasang.
2. **Dashboard Statistik**:
   - Jumlah Surat Masuk, Surat Keluar, Total Arsip, dan Jumlah Lampiran Berkas.
   - Daftar 5 arsip surat terkini dan tombol pintasan aksi cepat.
3. **Pengelolaan Surat Masuk & Keluar**:
   - Tambah, lihat detail, perbarui data, dan hapus data.
   - Pencarian cerdas (Agenda, Nomor Surat, Perihal, Asal/Tujuan, Isi Surat, Keterangan).
   - Filter berdasarkan jenis surat (Masuk / Keluar) dan rentang tanggal.
   - Persistensi data Cloud Firestore (`surat-4cee8`) — data tersimpan aman dan tidak hilang saat login dari perangkat lain.
4. **Pengelolaan Berkas Lampiran / Bukti Surat (Firebase Storage)**:
   - Mendukung berkas: **PDF, DOC, DOCX, JPG, JPEG, PNG** (hingga 25 MB).
   - Indikator progres upload real-time.
   - Buka / unduh berkas langsung dari modal detail.
   - Fitur penghapusan berkas fisik di Storage saat surat dihapus.
5. **Cetak Buku Agenda Resmi (Format F4 / Folio Landscape)**:
   - Sesuai standar tata persuratan dinas dengan Kop resmi (Logo Pemkab Jember kiri & Logo SDN Kesilir 02 kanan).
   - Urutan 9 Kolom Wajib:
     1. No.
     2. Tanggal
     3. Nomor Surat Masuk
     4. Nomor Surat Keluar
     5. Perihal
     6. Alamat Surat
     7. Isi Surat
     8. Keterangan
     9. Bukti Surat
   - **Aturan Cetak Khusus**: Kolom ke-9 (Bukti Surat) tetap ditampilkan secara utuh beserta garis sel tabel dan lebarnya, namun **isi di dalam sel dikosongkan** saat dicetak.
   - Filter cetak fleksibel: Semua data, berdasarkan tahun, bulan, atau rentang tanggal tertentu.
   - Blok tanda tangan Kepala Sekolah di kiri dan Pengelola/Operator Sekolah di kanan (Nama & NIP dapat diatur).
6. **Cetak Cover Buku Agenda (Format F4 / Folio Portrait)**:
   - Cover resmi berbingkai ganda (double border) dengan logo Pemkab Jember dan logo sekolah.
   - Periode / Tahun buku agenda dapat disesuaikan.
7. **Pengaturan Lembaga & Petugas**:
   - Data Kepala Sekolah (Nama & NIP), Operator Sekolah (Nama & NIP), Identitas Sekolah, serta Tahun Buku dapat diperbarui langsung melalui menu Pengaturan tanpa mengubah kode.

---

### 📁 Struktur Proyek
```text
├── public/
│   └── assets/
│       ├── logo-kabupaten-jember.png
│       └── logo-sdn-kesilir-02.png
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── LetterDetailModal.jsx
│   │   ├── LetterFormModal.jsx
│   │   ├── LettersTable.jsx
│   │   ├── LoginView.jsx
│   │   ├── PrintAgenda.jsx
│   │   ├── PrintCover.jsx
│   │   ├── SettingsView.jsx
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── services/
│   │   ├── auth.js          # Layanan autentikasi & role check
│   │   ├── letters.js       # Operasi CRUD Cloud Firestore
│   │   ├── settings.js      # Pengaturan identitas & pejabat
│   │   └── storage.js       # Validasi & upload Firebase Storage
│   ├── App.jsx              # Routing & manajemen state utama
│   ├── firebase.js          # Inisialisasi Firebase terpusat
│   ├── index.css            # Desain antarmuka responsif
│   ├── main.jsx             # React entry point
│   └── print.css            # Pengaturan layout cetak F4 Folio
├── .env.example             # Template variabel environment
├── .env.local               # Kredensial Firebase lokal (diabaikan git)
├── .gitignore               # Daftar proteksi file rahasia
├── firebase.json            # Konfigurasi resource Firebase
├── firestore.indexes.json   # Definisi indeks database
├── firestore.rules          # Aturan keamanan Cloud Firestore
├── package.json             # Dependensi proyek
├── storage.rules            # Aturan keamanan Cloud Storage
├── vercel.json              # Konfigurasi routing SPA di Vercel
└── vite.config.js           # Konfigurasi bundling Vite
```

---

### ⚙️ Konfigurasi Environment Variables
Aplikasi menggunakan environment variables dengan prefix `VITE_FIREBASE_`:
```env
VITE_FIREBASE_API_KEY=AIzaSyBTs9JSm4mCrZMt6b3A8Flvd3JthVFC5fM
VITE_FIREBASE_AUTH_DOMAIN=surat-4cee8.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=surat-4cee8
VITE_FIREBASE_STORAGE_BUCKET=surat-4cee8.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=314803998850
VITE_FIREBASE_APP_ID=1:314803998850:web:69366f1f75ac17b7f3249b
VITE_FIREBASE_MEASUREMENT_ID=G-BXYXLQ75CH
```
File `.env.local` telah disiapkan untuk kebutuhan pengembangan lokal. Pada hosting Vercel, variabel ini dimasukkan pada menu **Project Settings > Environment Variables**.

---

### 🛡️ Aturan Keamanan Firebase (Security Rules)

#### 1. Cloud Firestore (`firestore.rules`)
Menjamin hanya pengguna terautentikasi yang terdaftar di koleksi `/admins/{uid}` yang dapat membaca, menulis, memperbarui, atau menghapus arsip surat dan pengaturan.
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isAdmin() {
      return isAuthenticated() && (
        request.auth.token.admin == true ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }
    match /admins/{userId} {
      allow get: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow list: if isAdmin();
      allow write: if isAdmin();
    }
    match /letters/{letterId} {
      allow read, write: if isAdmin();
    }
    match /settings/{settingId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    match /logs/{logId} {
      allow read, write: if isAdmin();
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

#### 2. Cloud Storage (`storage.rules`)
Memvalidasi tipe berkas (PDF, DOC, DOCX, JPG, JPEG, PNG) serta membatasi ukuran maksimal 25 MB hanya untuk admin.
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isAdmin() {
      return isAuthenticated() && (
        request.auth.token.admin == true ||
        firestore.exists(/databases/(default)/documents/admins/$(request.auth.uid))
      );
    }
    match /letters/{letterId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAdmin()
        && request.resource.size < 25 * 1024 * 1024
        && (
          request.resource.contentType.matches('application/pdf')
          || request.resource.contentType.matches('image/(jpeg|png|jpg)')
          || request.resource.contentType.matches('application/msword')
          || request.resource.contentType.matches('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
          || request.resource.contentType.matches('application/octet-stream')
        );
      allow delete: if isAdmin();
    }
    match /assets/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

### 🔑 Cara Membuat Akun Admin Pertama
1. **Melalui Antarmuka Aplikasi**:
   - Pada halaman login, klik **"Inisialisasi / Bantuan Akun Admin Perdana"**.
   - Masukkan Nama, Email (contoh: `admin@kesilir02.sch.id`), dan Password (minimal 6 karakter).
   - Sistem akan mendaftarkan akun di Firebase Auth dan membuat dokumen profil di koleksi `/admins/{uid}`.
   - *Catatan*: Fitur ini hanya dapat digunakan ketika koleksi `/admins` belum memiliki admin.
2. **Melalui Firebase Console**:
   - Buka [Firebase Console](https://console.firebase.google.com/) > Pilih Proyek `surat-4cee8`.
   - Masuk ke **Authentication** > **Users** > Klik **Add user** > Masukkan email dan password.
   - Salin **User UID** pengguna tersebut.
   - Masuk ke **Firestore Database** > Klik **Start collection** dengan nama `admins`.
   - Masukkan Document ID dengan **User UID** tersebut, lalu tambahkan field:
     - `role`: string `"admin"`
     - `email`: string email admin
     - `displayName`: string nama admin.

---

### 📤 Panduan Unggah ke GitHub & Deploy ke Vercel

#### 1. Push ke GitHub
```bash
git add .
git commit -m "feat: inisialisasi aplikasi surat SD Negeri Kesilir 02 siap produksi"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO.git
git push -u origin main
```

#### 2. Deploy ke Vercel
1. Buka [vercel.com](https://vercel.com/) dan login menggunakan akun GitHub Anda.
2. Klik tombol **Add New...** > **Project**.
3. Pilih repository GitHub proyek ini, lalu klik **Import**.
4. Konfigurasi build (otomatis terdeteksi):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Buka bagian **Environment Variables**, lalu masukkan ketujuh variabel berikut sesuai isi `.env.local`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
6. Klik **Deploy**.
7. Setelah website online, salin domain Vercel Anda (misal `https://sim-surat-kesilir02.vercel.app`), lalu buka [Firebase Console](https://console.firebase.google.com/) > **Authentication** > **Settings** > **Authorized Domains** > Klik **Add domain** dan tambahkan domain Vercel Anda agar login dapat berjalan tanpa kendala.
