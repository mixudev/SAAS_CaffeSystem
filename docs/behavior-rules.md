# AI Behavior & Coding Rules - Sistem Manajemen Cafe

Dokumen ini mendefinisikan batasan perilaku, etika pengeditan kode, aturan penambahan dependency, serta format komunikasi yang **wajib** dipatuhi oleh AI coding agent selama pengembangan sistem ini.

## Aturan Pengeditan Kode (Code Editing Rules)

1. **Surgical Edits Only (Edit Terfokus)**:
   - AI harus selalu melakukan modifikasi kode yang terfokus pada baris/blok yang ditargetkan saja.
   - **Dilarang keras melakukan refactoring besar-besaran** pada file yang tidak berhubungan langsung dengan tugas yang sedang dikerjakan, kecuali jika diminta secara eksplisit.
   - Minimalkan *code churn* (perubahan kode yang tidak perlu) untuk menghindari konflik git dan bug baru.

2. **Konsistensi Struktur Berkas**:
   - Selalu ikuti pola desain *Modular Monolith* yang sudah ada di folder `backend/app/Modules` dan struktur halaman/routing di `frontend/src`.
   - Jangan memindahkan file atau membuat file di direktori non-standar tanpa konfirmasi.

3. **Dokumentasi & Komentar Kode**:
   - **Dilarang keras menghapus komentar kode atau docstrings** yang sudah ada di codebase, kecuali jika logika di bawahnya benar-benar dihapus atau diubah secara total.
   - Tulis komentar baru hanya untuk menjelaskan logika bisnis yang kompleks atau tidak biasa (non-obvious logic). Gunakan Bahasa Inggris untuk komentar kode.

---

## Aturan Dependency & Library Baru

1. **Gunakan Library yang Sudah Ada**:
   - Sebelum menyarankan package baru (Composer atau NPM), periksa apakah library bawaan framework (Laravel/ReactJS) atau dependency yang sudah terinstall di `package.json` / `composer.json` dapat menyelesaikan masalah tersebut.
   - Contoh: Gunakan helper native JavaScript untuk manipulasi tanggal sebelum menyarankan `moment.js` atau `date-fns`, gunakan utility class CSS bawaan sebelum membuat file CSS baru.

2. **Prosedur Penambahan Dependency**:
   - AI **dilarang keras menginstalisasi package baru secara sepihak** (misalnya menjalankan `npm install` atau `composer require` secara diam-diam).
   - AI harus menjelaskan mengapa package tersebut dibutuhkan, apa alternatifnya, dan meminta izin tertulis dari pengguna sebelum mengusulkan instalasi.

---

## Aturan Migrasi & Struktur Database

1. **Dilarang Mengedit File Migrasi Lama**:
   - Jika tabel database perlu diubah (tambah kolom, ubah tipe data, dll), AI **dilarang mengubah berkas migrasi lama yang sudah di-commit** (migration history).
   - AI wajib membuat berkas migrasi baru (misalnya `add_column_x_to_table_y`) menggunakan Artisan command.

2. **Uji Query Planner**:
   - Setiap kali mengusulkan perubahan indeks database atau query baru yang berat, gunakan `EXPLAIN` atau `EXPLAIN ANALYZE` di PostgreSQL untuk memverifikasi efektivitas query tersebut.

---

## Aturan Keamanan & Autentikasi

1. **No Hardcoded Secrets**:
   - Jangan pernah menulis password, token, API key, atau kredensial apa pun di dalam kode sumber. Gunakan `.env` (backend) atau `.env.local` (frontend).
2. **Jangan Bypass Otorisasi**:
   - Dilarang keras menonaktifkan middleware autentikasi Sanctum, CSRF check, atau policy RBAC demi mempermudah debugging lokal. Seluruh endpoint baru harus dideklarasikan di bawah middleware yang tepat.

---

## Format Komunikasi & Penanganan Ambiguitas

1. **Format Laporan Perubahan (Diff Format)**:
   - Saat melaporkan perubahan kode, tunjukkan potongan kode sebelum dan sesudah perubahan (diff format), atau sebutkan secara presisi nama file dan baris yang diubah.
   - Hindari menulis ulang seluruh isi file panjang jika perubahan hanya terjadi pada beberapa baris.

2. **Penanganan Instruksi Ambigu**:
   - Jika instruksi pengguna tidak jelas atau memiliki interpretasi ganda, AI harus **berhenti dan meminta klarifikasi** terlebih dahulu sebelum menulis kode apa pun.
   - Jika terpaksa membuat keputusan cepat, buatlah asumsi yang paling aman, dokumentasikan keputusan tersebut dengan tag `[ASUMSI: ...]` di bagian atas kode/pesan, dan beri tahu pengguna.
