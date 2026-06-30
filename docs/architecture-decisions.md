# Architecture Decisions (ADR) - Sistem Manajemen Cafe

Dokumen ini mendokumentasikan keputusan arsitektur kunci yang telah diambil beserta latar belakang rasionalnya, serta konsekuensi/trade-off yang disepakati.

## 1. Modular Monolith Backend (Laravel 13)

### Keputusan
Arsitektur backend dibangun sebagai **Modular Monolith** dalam satu repositori Laravel, bukan Microservices terpisah. Kode dibagi secara tegas per domain (Auth, POS, Inventory, HR, Payroll, Reporting) di bawah namespace `App\Modules`.

### Rasional
- Menghindari overhead operasional mikroservis (seperti service discovery, network latency, distributed tracing, pemeliharaan banyak pipeline CI/CD).
- Mempertahankan batasan domain yang jelas sejak awal. Jika di kemudian hari modul POS atau Payroll perlu dipecah menjadi servis independen, struktur kodenya sudah terisolasi dan mudah dipindahkan.
- Cocok untuk ukuran tim kecil dan sumber daya komputasi server awal yang terbatas.

### Trade-off & Konsekuensi
- **Skalabilitas Monolitik**: Skalabilitas aplikasi bersifat all-or-nothing. Jika modul Payroll mengalami lonjakan CPU, seluruh backend monolith harus di-scale secara horizontal/vertikal.
- **Single Point of Failure (SPOF)**: Bug fatal pada satu modul (misal memory leak di Reporting) berpotensi memengaruhi ketersediaan modul POS.

---

## 2. ReactJS (Vite) PWA untuk Frontend

### Keputusan
Frontend dipisah secara total dari backend Laravel, dibangun menggunakan **ReactJS dengan Vite** dengan tipe **Progressive Web App (PWA)** pada client POS.

### Rasional
- Memisahkan beban render UI dari server Laravel API.
- POS membutuhkan antarmuka yang sangat responsif, ramah tablet, dan harus tetap bekerja saat internet terputus (offline-first). PWA memungkinkan pendaftaran Service Worker untuk meng-caching aset statis secara agresif dan menyajikan aplikasi secara lokal.
- Menggunakan ReactJS (Vite) menghasilkan static assets (Single Page Application - SPA murni) yang dapat disajikan langsung oleh web server ringan seperti Nginx, tanpa memerlukan runtime Node.js di server production. Hal ini secara signifikan mengurangi beban memori dan overhead CPU di sisi server.
- Dashboard admin dan owner merespons dengan sangat cepat karena manipulasi DOM client-side yang optimal pada React.

### Trade-off & Konsekuensi
- **Kompleksitas Offline-First**: Implementasi sinkronisasi data offline ke online (melalui IndexedDB) membutuhkan manajemen konflik data di sisi backend yang cukup rumit (idempotency key, deteksi konflik stok).
- **Static Deployment**: Karena merupakan SPA statis murni, kita tidak memiliki Server-Side Rendering (SSR) dinamis bawaan seperti Next.js. Namun, untuk aplikasi SaaS internal/manajemen kafe, SEO tidak terlalu krusial dan SSR tidak diperlukan, sehingga trade-off ini sangat menguntungkan.

---

## 3. Database PostgreSQL 16 (Primary & Replica) dengan Partitioning

### Keputusan
Menggunakan database relasional PostgreSQL 16 sebagai database transaksional utama. Laporan agregat membaca dari **Read Replica** (bukan primary), tabel transaksional besar di-partitioning per bulan, dan dashboard dilayani oleh **Materialized Views**.

### Rasional
- Data keuangan cafe sangat membutuhkan integritas ACID yang kuat (PostgreSQL).
- Memisahkan query tulis transaksi kasir (Primary) dari query baca laporan bulanan yang berat (Replica) mencegah kasir mengalami lag saat owner sedang menarik laporan tahunan.
- Tabel `orders` dan `order_items` bertumbuh jutaan baris per tahun. Monthly range partitioning mencegah degradasi performa query bulanan.

### Trade-off & Konsekuensi
- **Lag Replika**: Terdapat jeda waktu sangat kecil (biasanya milidetik) antara penulisan di Primary dan pembacaan di Replica, yang harus ditoleransi oleh modul Reporting.
- **Kompleksitas Sinkronisasi Cache**: Materialized view harus diperbarui secara terjadwal (Scheduler). Data laporan di dashboard owner tidak bersifat real-time detik-demi-detik, melainkan memiliki delay (misal diperbarui tiap 1 jam) guna menghemat CPU database.

---

## 4. Single-Tenant dengan Skema Siap Multi-Tenant

### Keputusan
Sistem diluncurkan sebagai aplikasi **Single-Tenant** (satu pemilik usaha, multi-outlet). Namun, kolom `outlet_id` wajib disertakan pada setiap tabel transaksional sejak awal.

### Rasional
- Menghindari kompleksitas *over-engineering* skema isolasi data multi-tenant (seperti skema per-tenant atau multi-database) di fase peluncuran awal.
- Mempermudah migrasi ke SaaS di masa depan. Konversi dari single-tenant ke multi-tenant nantinya hanya perlu menambahkan kolom `tenant_id` pada level global query filter tanpa harus mengubah relasi foreign key fundamental antar tabel.

### Trade-off & Konsekuensi
- Setiap query database di backend wajib menyertakan filter scope `outlet_id` secara manual atau via global scope, yang menambah sedikit boilerplate kode di awal.
