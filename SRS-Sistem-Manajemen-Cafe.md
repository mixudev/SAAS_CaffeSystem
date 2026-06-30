# Software Requirements Specification (SRS)
# Sistem Manajemen Cafe (Cafe Management System)

**Versi Dokumen:** 1.0
**Tanggal:** 30 Juni 2026
**Status:** Draft Siap Production
**Disusun berdasarkan:** IEEE 830 / ISO/IEC/IEEE 29148 (disesuaikan untuk kebutuhan praktis tim kecil)

---

## Daftar Isi

1. Pendahuluan
2. Deskripsi Umum Sistem
3. Spesifikasi Pengguna dan Peran (Role)
4. Kebutuhan Fungsional
5. Kebutuhan Non-Fungsional
6. Arsitektur Sistem
7. Desain Basis Data
8. Desain API
9. Keamanan Sistem
10. Infrastruktur & Deployment (Docker)
11. Observability, Logging, dan Monitoring
12. Strategi Backup & Disaster Recovery
13. Strategi Pengujian (Testing)
14. Rencana Pengembangan Bertahap (Roadmap)
15. Lampiran

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen ini menjelaskan kebutuhan perangkat lunak (functional dan non-functional) untuk Sistem Manajemen Cafe secara lengkap, mencakup modul Point of Sale (POS), Inventory, Human Resource (HR), Payroll, dan Reporting. Dokumen ini menjadi acuan tunggal (single source of truth) bagi pengembang, baik saat ini maupun developer lain yang bergabung di kemudian hari, agar pembangunan sistem konsisten, terukur, dan siap dioperasikan dalam lingkungan production.

### 1.2 Ruang Lingkup Produk

Sistem ini adalah aplikasi manajemen operasional cafe berbasis web yang mencakup:

- Transaksi penjualan di kasir (Point of Sale)
- Manajemen stok dan resep produk (Inventory)
- Manajemen shift, absensi, dan cuti karyawan (HR)
- Penghitungan gaji otomatis berbasis kehadiran (Payroll)
- Pelaporan dan dashboard analitik untuk pemilik usaha (Reporting & Owner Dashboard)

Sistem dirancang **single-tenant terlebih dahulu** (satu pemilik usaha, bisa multi-outlet), dengan skema basis data yang sudah disiapkan untuk migrasi ke multi-tenant di masa depan tanpa perlu migrasi struktural besar.

### 1.3 Definisi, Akronim, dan Singkatan

| Istilah | Penjelasan |
|---|---|
| POS | Point of Sale, sistem kasir |
| RBAC | Role-Based Access Control |
| SRS | Software Requirements Specification |
| Outlet | Cabang fisik tempat usaha beroperasi |
| Tenant | Entitas bisnis independen (digunakan jika sistem berkembang jadi multi-tenant/SaaS) |
| JWT | JSON Web Token, digunakan untuk autentikasi |
| SLA | Service Level Agreement |
| RTO | Recovery Time Objective |
| RPO | Recovery Point Objective |
| GIN | Generalized Inverted Index (tipe index PostgreSQL) |
| TTL | Time To Live (durasi cache) |

### 1.4 Referensi

- Dokumentasi arsitektur awal proyek (internal)
- PostgreSQL Documentation — Indexing & Partitioning
- Laravel 13 Documentation — Queue, Sanctum, Scheduler
- ReactJS (Vite) Documentation
- OWASP Top 10 (acuan keamanan aplikasi web)

### 1.5 Audiens Dokumen

Dokumen ini ditujukan untuk: pengembang (developer/AI coding agent yang membangun sistem), project manager/product owner (pemilik proyek), serta calon kontributor lain yang akan melanjutkan atau memelihara sistem.

---

## 2. Deskripsi Umum Sistem

### 2.1 Perspektif Produk

Sistem ini berdiri sebagai aplikasi mandiri (standalone), bukan bagian dari sistem pihak ketiga. Sistem dibangun dengan arsitektur **modular monolith** — satu basis kode backend yang dipecah secara jelas per domain (POS, Inventory, HR, Payroll, Reporting), bukan microservice penuh. Keputusan ini diambil karena skala operasional saat ini (satu usaha, kemungkinan beberapa outlet) belum membutuhkan kompleksitas operasional microservice seperti service discovery, distributed tracing, dan deployment terpisah per service. Microservice baru dipertimbangkan ketika jumlah tenant dan trafik bertambah signifikan serta tim pengembang sudah cukup besar untuk memelihara banyak service secara independen.

### 2.2 Fungsi Utama Produk

1. Pencatatan transaksi penjualan secara cepat di kasir, termasuk dukungan mode offline-first.
2. Pengelolaan stok bahan baku dan resep produk, dengan pengurangan stok otomatis saat transaksi terjadi.
3. Pengelolaan shift kerja, absensi, dan pengajuan cuti karyawan.
4. Penghitungan gaji otomatis berbasis data kehadiran dan aturan payroll yang dapat dikonfigurasi.
5. Penyajian laporan dan dashboard analitik real-time maupun terjadwal untuk level outlet dan level pemilik usaha (seluruh outlet).

### 2.3 Karakteristik Pengguna

Sistem digunakan oleh empat kategori utama pengguna dengan tingkat literasi teknologi yang berbeda: kasir (operasional harian, butuh antarmuka sederhana dan cepat), manager outlet (operasional + administratif), staf non-kasir (hanya melihat data pribadi), dan owner/finance (akses penuh, analitik dan strategis). Lihat Bagian 3 untuk rincian peran.

### 2.4 Batasan (Constraints)

- Sistem tahap awal dirancang single-tenant; fitur multi-tenant penuh (isolasi data antar pemilik usaha berbeda dalam satu instance) tidak dikerjakan di fase awal, namun skema kolom `outlet_id` disiapkan sejak awal.
- Stack teknologi yang dipilih harus mendukung deployment via Docker pada server dengan resource terbatas (estimasi awal: 2 vCPU, 4–8 GB RAM untuk skala 1–5 outlet).
- Modul POS harus tetap dapat mencatat transaksi meskipun koneksi internet ke server pusat terputus sementara (offline-first), dan melakukan sinkronisasi otomatis saat koneksi kembali tersedia.
- Bahasa antarmuka utama: Bahasa Indonesia, dengan struktur kode dan penamaan database tetap menggunakan Bahasa Inggris untuk konsistensi standar pengembangan.

### 2.5 Asumsi dan Dependensi

- Diasumsikan setiap outlet memiliki koneksi internet, meskipun bisa terputus sewaktu-waktu (bukan tidak punya internet sama sekali).
- Diasumsikan satu karyawan hanya terdaftar pada satu outlet utama dalam fase awal (multi-outlet assignment untuk satu karyawan menjadi pertimbangan fase lanjutan).
- Bergantung pada layanan pihak ketiga untuk hal opsional seperti push notification atau payment gateway (jika di kemudian hari ditambahkan pembayaran digital/QRIS).

---

## 3. Spesifikasi Pengguna dan Peran (Role)

### 3.1 Daftar Peran

| Role | Halaman Utama Setelah Login | Hak Akses |
|---|---|---|
| `cashier` | `/pos` | Hanya transaksi penjualan, tidak bisa melihat laporan keuangan atau payroll |
| `manager` | `/admin` | Akses POS, inventory, HR (approve cuti, atur shift), laporan outlet sendiri saja |
| `owner` | `/owner` | Akses penuh ke seluruh outlet, laporan agregat, payroll, dan HR semua cabang |
| `staff` (non-kasir) | `/hr/me` | Hanya melihat jadwal sendiri, mengajukan cuti, melihat slip gaji pribadi |
| `finance` (opsional, dapat digabung dengan owner) | `/payroll` | Akses modul payroll dan laporan keuangan, tanpa akses HR approval |

### 3.2 Aturan Umum RBAC

- Setiap permintaan API divalidasi melalui middleware otorisasi di sisi backend (bukan hanya disembunyikan di sisi UI), sehingga role yang tidak berhak tidak dapat mengakses endpoint terkait meskipun mencoba memanggil API secara langsung.
- Permission bersifat granular (bukan hanya role check sederhana), contoh: `payroll.view`, `payroll.generate`, `hr.leave.approve`, `inventory.adjust`, `report.export`. Hal ini memudahkan penyesuaian akses di masa depan tanpa membuat role baru untuk setiap kombinasi izin.
- Satu pengguna dapat memiliki lebih dari satu role (misal manager yang merangkap kasir saat shift tertentu).

### 3.3 Use Case Ringkas per Role

**Cashier**: login → buka sesi kasir (cash drawer opening) → input transaksi → cetak/kirim struk → tutup sesi kasir (cash reconciliation) di akhir shift.

**Manager**: semua use case cashier + kelola stok masuk/keluar manual + atur jadwal shift karyawan + approve/reject pengajuan cuti + lihat laporan penjualan & stok outletnya.

**Owner**: semua use case manager untuk seluruh outlet + bandingkan performa antar outlet + generate dan approve payroll + kelola pengguna dan role + lihat audit log sistem.

**Staff**: lihat jadwal shift pribadi → ajukan cuti → lihat status pengajuan → lihat slip gaji setelah payroll diproses.

---

## 4. Kebutuhan Fungsional

Setiap kebutuhan fungsional diberi kode unik `FR-[MODUL]-[NOMOR]` agar dapat dilacak (traceable) ke kasus uji (test case) pada fase pengujian.

### 4.1 Modul Autentikasi & Otorisasi

| Kode | Kebutuhan |
|---|---|
| FR-AUTH-01 | Sistem menyediakan satu halaman login (`/login`) untuk seluruh role. |
| FR-AUTH-02 | Sistem melakukan redirect otomatis ke dashboard sesuai role setelah login berhasil, berdasarkan data role yang tersimpan di JWT/session. |
| FR-AUTH-03 | Sistem mendukung mekanisme refresh token agar sesi kasir tidak terputus mendadak di tengah jam operasional. |
| FR-AUTH-04 | Sistem mencatat setiap percobaan login gagal untuk keperluan audit dan deteksi brute-force. |
| FR-AUTH-05 | Sistem menyediakan mekanisme reset password melalui email atau melalui reset oleh admin/owner. |
| FR-AUTH-06 | Akses ke setiap route/halaman dan endpoint API diproteksi melalui middleware berbasis role dan permission. |

### 4.2 Modul Point of Sale (POS)

| Kode | Kebutuhan |
|---|---|
| FR-POS-01 | Kasir dapat membuka sesi kasir di awal shift dengan mencatat kas awal (opening cash). |
| FR-POS-02 | Kasir dapat menambahkan produk ke keranjang transaksi, mengubah jumlah, dan menghapus item. |
| FR-POS-03 | Sistem mendukung berbagai metode pembayaran: tunai, kartu (manual input/EDC eksternal), dan QRIS (opsional, fase lanjutan). |
| FR-POS-04 | Sistem mencetak atau mengirim struk digital setelah transaksi berhasil. |
| FR-POS-05 | Sistem mengurangi stok bahan baku secara otomatis berdasarkan resep produk yang terjual. |
| FR-POS-06 | Kasir dapat menutup sesi kasir di akhir shift dan sistem menghitung selisih kas (cash reconciliation) antara kas sistem dan kas fisik yang diinput kasir. |
| FR-POS-07 | **Transaksi tetap dapat dicatat saat koneksi internet terputus** (disimpan di local storage/IndexedDB pada PWA), dan tersinkronisasi otomatis ke server saat koneksi kembali normal. |
| FR-POS-08 | Sistem mendeteksi dan menandai potensi konflik data saat sinkronisasi offline (misal stok yang sudah berubah di server saat transaksi offline dibuat), serta menyediakan log konflik untuk ditinjau manager. |
| FR-POS-09 | Sistem mendukung pembatalan/refund transaksi dengan approval dari manager (tidak bisa dilakukan sepihak oleh kasir). |
| FR-POS-10 | Sistem menampilkan status pesanan dapur secara real-time ke layar kasir (jika modul dapur/kitchen display diaktifkan). |

### 4.3 Modul Inventory

| Kode | Kebutuhan |
|---|---|
| FR-INV-01 | Sistem menyimpan data bahan baku (raw material) dengan satuan ukur masing-masing. |
| FR-INV-02 | Sistem menyimpan resep (recipe) tiap produk yang memetakan produk ke kombinasi bahan baku dan jumlah pemakaiannya. |
| FR-INV-03 | Sistem mengurangi stok bahan baku otomatis setiap kali transaksi penjualan produk terkait berhasil. |
| FR-INV-04 | Manager dapat melakukan penyesuaian stok manual (stock adjustment) dengan alasan yang wajib dicatat (rusak, kadaluarsa, kesalahan input, dll). |
| FR-INV-05 | Sistem mengirim notifikasi/alert saat stok bahan baku mencapai ambang minimum (low stock threshold) yang dapat dikonfigurasi per item. |
| FR-INV-06 | Sistem mencatat riwayat lengkap pergerakan stok (stock ledger) untuk keperluan audit. |
| FR-INV-07 | Sistem mendukung pencatatan pembelian/restock dari supplier, termasuk harga beli untuk perhitungan cost of goods sold (COGS). |

### 4.4 Modul HR (Human Resource)

| Kode | Kebutuhan |
|---|---|
| FR-HR-01 | Manager dapat membuat dan mengatur jadwal shift karyawan per outlet. |
| FR-HR-02 | Karyawan dapat melakukan absen masuk/keluar (clock-in/clock-out), didukung verifikasi lokasi (geofencing) atau QR code di outlet untuk mencegah absen fiktif. |
| FR-HR-03 | Karyawan dapat mengajukan cuti/izin melalui sistem, lengkap dengan jenis cuti dan rentang tanggal. |
| FR-HR-04 | Manager/owner dapat menyetujui atau menolak pengajuan cuti, dengan alasan wajib diisi saat penolakan. |
| FR-HR-05 | Sistem menghitung otomatis sisa kuota cuti tahunan karyawan. |
| FR-HR-06 | Sistem mencatat keterlambatan (late clock-in) dan ketidakhadiran tanpa keterangan secara otomatis berdasarkan jadwal shift yang ditetapkan. |
| FR-HR-07 | Sistem menyediakan riwayat absensi yang dapat difilter per karyawan, per outlet, dan per periode. |

### 4.5 Modul Payroll

| Kode | Kebutuhan |
|---|---|
| FR-PAY-01 | Sistem menghitung gaji otomatis berdasarkan data kehadiran, jumlah jam kerja, dan aturan upah (per jam/bulanan/shift) yang dapat dikonfigurasi per karyawan. |
| FR-PAY-02 | Sistem mendukung komponen gaji tambahan: tunjangan, lembur (overtime), potongan (denda telat, BPJS, pinjaman), dan bonus. |
| FR-PAY-03 | Proses generate payroll dijalankan melalui job queue (bukan langsung/synchronous) agar tidak membebani server saat memproses banyak karyawan sekaligus. |
| FR-PAY-04 | Owner/finance harus melakukan approval sebelum slip gaji difinalisasi dan dapat dilihat karyawan. |
| FR-PAY-05 | Sistem menghasilkan slip gaji digital (dapat diunduh sebagai PDF) untuk setiap karyawan setiap periode payroll. |
| FR-PAY-06 | Sistem menyimpan riwayat payroll tiap periode untuk keperluan audit dan rekap tahunan (misal kebutuhan pajak). |

### 4.6 Modul Reporting & Dashboard

| Kode | Kebutuhan |
|---|---|
| FR-REP-01 | Sistem menyediakan laporan penjualan harian/mingguan/bulanan per outlet. |
| FR-REP-02 | Owner dapat melihat laporan agregat seluruh outlet dengan kemampuan membandingkan performa antar outlet. |
| FR-REP-03 | Sistem menyediakan laporan stok (pemakaian bahan baku, nilai inventory, item yang mendekati kadaluarsa). |
| FR-REP-04 | Sistem menyediakan laporan kehadiran dan payroll dalam bentuk rekap per periode. |
| FR-REP-05 | Laporan dapat diekspor ke format Excel (.xlsx) dan PDF. |
| FR-REP-06 | Laporan agregat berat (misal total penjualan bulanan lintas outlet) disajikan dari materialized view yang diperbarui terjadwal, bukan dihitung ulang secara real-time setiap kali dashboard dibuka. |

---

## 5. Kebutuhan Non-Fungsional

Kebutuhan non-fungsional diberi kode `NFR-[KATEGORI]-[NOMOR]`.

### 5.1 Performa

| Kode | Kebutuhan |
|---|---|
| NFR-PERF-01 | Waktu respons transaksi POS (dari klik bayar hingga struk tercetak) tidak boleh lebih dari 1.5 detik pada kondisi jaringan normal. |
| NFR-PERF-02 | Dashboard laporan harus memuat data dalam waktu kurang dari 3 detik untuk rentang data 1 bulan, dengan memanfaatkan materialized view dan caching. |
| NFR-PERF-03 | Sistem harus tetap responsif (tidak timeout) ketika menangani hingga 50 transaksi per menit per outlet pada beban puncak (jam sibuk). |
| NFR-PERF-04 | Query pelaporan dengan rentang data lebih dari 3 bulan harus tetap berjalan di bawah 5 detik melalui mekanisme partitioning tabel. |

### 5.2 Skalabilitas

| Kode | Kebutuhan |
|---|---|
| NFR-SCAL-01 | Sistem harus mampu menangani pertumbuhan data transaksi hingga jutaan baris per tahun tanpa degradasi performa signifikan, melalui strategi partitioning dan archiving. |
| NFR-SCAL-02 | Arsitektur basis data harus mendukung penambahan outlet baru tanpa migrasi struktural (cukup insert data outlet baru). |
| NFR-SCAL-03 | Sistem harus dapat di-scale secara horizontal pada level aplikasi (menambah instance container) tanpa mengubah arsitektur dasar. |

### 5.3 Keandalan dan Ketersediaan (Reliability & Availability)

| Kode | Kebutuhan |
|---|---|
| NFR-REL-01 | Target ketersediaan sistem (uptime) sebesar 99.5% per bulan, di luar jadwal maintenance terencana. |
| NFR-REL-02 | Modul POS harus tetap dapat mencatat transaksi secara lokal walau koneksi ke server pusat terputus, sesuai FR-POS-07. |
| NFR-REL-03 | Proses kritikal (payroll generation, sinkronisasi data offline) harus idempotent — bila dijalankan ulang akibat retry/error, tidak menghasilkan duplikasi data. |

### 5.4 Keamanan

Lihat Bagian 9 untuk rincian lengkap kebutuhan keamanan. Secara ringkas: seluruh komunikasi terenkripsi (HTTPS/TLS), kata sandi di-hash dengan algoritma standar industri, dan akses data diaudit melalui log.

### 5.5 Usability

| Kode | Kebutuhan |
|---|---|
| NFR-USA-01 | Antarmuka kasir harus dapat dioperasikan dengan jumlah klik/tap minimal untuk transaksi umum (target: maksimal 3 tap untuk transaksi satu item dengan pembayaran tunai pas). |
| NFR-USA-02 | Antarmuka harus tetap nyaman digunakan pada perangkat layar sentuh ukuran tablet (POS) maupun layar desktop (dashboard admin/owner). |
| NFR-USA-03 | Pesan error harus disampaikan dalam Bahasa Indonesia yang jelas dan actionable, bukan pesan teknis mentah. |

### 5.6 Maintainability

| Kode | Kebutuhan |
|---|---|
| NFR-MAIN-01 | Kode backend dipisah secara modular per domain (POS, Inventory, HR, Payroll, Reporting) agar perubahan di satu modul minim berdampak ke modul lain. |
| NFR-MAIN-02 | Setiap environment (development, staging, production) harus dapat dijalankan ulang secara identik melalui konfigurasi Docker, tanpa instalasi manual dependency di mesin host. |
| NFR-MAIN-03 | Sistem harus menyediakan dokumentasi API (misal melalui OpenAPI/Swagger) yang selalu sinkron dengan implementasi. |

### 5.7 Portabilitas

| Kode | Kebutuhan |
|---|---|
| NFR-PORT-01 | Seluruh komponen sistem (aplikasi, database, cache, web server) berjalan dalam container Docker sehingga dapat dipindahkan antar server/provider cloud tanpa konfigurasi ulang signifikan. |

### 5.8 Kepatuhan (Compliance)

| Kode | Kebutuhan |
|---|---|
| NFR-COMP-01 | Pengelolaan data karyawan (termasuk data kependudukan dan gaji) memperhatikan prinsip perlindungan data pribadi sesuai UU PDP (Pelindungan Data Pribadi) yang berlaku di Indonesia. |
| NFR-COMP-02 | Struktur slip gaji dan rekap payroll disiapkan agar mudah diadaptasi untuk kebutuhan pelaporan pajak (PPh 21) di kemudian hari. |

---

## 6. Arsitektur Sistem

### 6.1 Gaya Arsitektur

Sistem menggunakan **modular monolith** untuk backend: satu aplikasi yang dapat dideploy sebagai satu unit, namun secara internal dipecah ke dalam modul/domain yang tegas batasannya (bounded context) — POS, Inventory, HR, Payroll, Reporting, dan modul lintas-domain (Auth, User Management, Notification). Setiap modul memiliki struktur folder, model, dan service-nya sendiri, serta berkomunikasi antar modul melalui interface/service layer yang jelas, bukan saling mengakses model domain lain secara langsung. Pendekatan ini memberi sebagian besar keuntungan microservice (batasan domain jelas, mudah dipecah nanti) tanpa overhead operasional microservice (banyak deployment, network call antar service, distributed transaction).

### 6.2 Diagram Arsitektur Tingkat Tinggi (High-Level)

```
                         ┌─────────────────────────┐
                         │        Pengguna         │
                         │ (Kasir, Manager, Owner, │
                         │   Staff via Browser/PWA)│
                         └───────────┬─────────────┘
                                     │ HTTPS
                         ┌───────────▼─────────────┐
                         │   Nginx (Reverse Proxy) │
                         │   + TLS Termination      │
                         └─────┬───────────────┬────┘
                               │               │
                  ┌────────────▼───┐   ┌───────▼──────────┐
                  │  ReactJS App   │   │  Laravel API      │
                  │ (POS PWA +     │   │ (Modular Monolith:│
                  │  Dashboard UI) │   │  Auth, POS, Inv,  │
                  │                │   │  HR, Payroll, Rep)│
                  └────────┬───────┘   └─────┬──────┬──────┘
                           │                 │      │
                           │           ┌─────▼──┐ ┌─▼─────────┐
                           │           │ Redis   │ │ PostgreSQL│
                           │           │ (Cache, │ │ (Primary) │
                           │           │ Queue,  │ │           │
                           │           │ Session)│ │           │
                           │           └─────────┘ └─────┬─────┘
                           │                              │
                           │                       ┌──────▼──────┐
                           │                       │ Read Replica │
                           │                       │ (Reporting)  │
                           │                       └──────────────┘
                           │
                  ┌────────▼─────────┐
                  │ IndexedDB/Local   │
                  │ Storage (Offline  │
                  │ POS Queue di Sisi │
                  │ Klien)            │
                  └───────────────────┘
```

### 6.3 Komponen Sistem

| Komponen | Peran |
|---|---|
| Nginx | Reverse proxy, TLS termination, load balancing antar instance aplikasi, static file serving |
| ReactJS App (Vite) | Merender UI POS (PWA, offline-capable) dan dashboard admin/owner/HR; berkomunikasi ke Laravel API via REST |
| Laravel API | Backend utama, modular monolith berisi seluruh business logic dan akses data (menggunakan Laravel 13) |
| PostgreSQL (Primary) | Basis data transaksional utama, menerima seluruh operasi tulis |
| PostgreSQL (Read Replica) | Menangani query laporan berat agar tidak mengganggu performa transaksi di primary |
| Redis | Cache data statis/laporan, message broker untuk queue Laravel, penyimpanan session |
| Worker/Queue Process | Proses job asinkron: generate payroll, export laporan, kirim notifikasi |

### 6.4 Alasan Pemisahan Frontend POS dan Dashboard secara Route

POS membutuhkan antarmuka yang sangat responsif dan minim klik, dioptimalkan untuk layar sentuh kasir, sedangkan dashboard admin/owner lebih berorientasi ke tabel data, grafik, dan formulir yang panjang. Memisahkan keduanya secara route (bukan hanya komponen) memberi manfaat: lazy loading per modul (POS tidak perlu memuat library chart milik dashboard), pemisahan code-splitting berbasis role yang lebih jelas, dan jika di kemudian hari POS dikembangkan menjadi PWA/offline-first yang lebih berat, modul lain tidak ikut terbebani oleh service worker dan caching strategy POS.

### 6.5 Pemisahan Dashboard & Flow Halaman

```
/                       → Landing page (marketing, fitur)
/login                  → Satu pintu login untuk semua role
/pos                    → Dashboard Kasir (role: cashier)
/admin                  → Dashboard Manager/Admin Outlet (role: manager)
/owner                  → Dashboard Owner (role: owner)
/hr                     → Modul HR (shift, cuti, absensi) - manager & owner
/hr/me                  → Tampilan personal staff (jadwal, cuti, slip gaji)
/payroll                → Modul Payroll - hanya owner/finance
```

Routing dan redirect setelah login diatur lewat **router protection** di sisi ReactJS (React Router), dikombinasikan dengan validasi token/permission di sisi Laravel API untuk setiap request — bukan hanya pengecekan di komponen UI.

---

## 7. Desain Basis Data

### 7.1 Prinsip Desain Skema

Seluruh tabel transaksional (`orders`, `order_items`, `attendance_logs`, `payroll_records`, `stock_movements`) menyertakan kolom `outlet_id` sejak awal walau sistem baru dipakai untuk satu outlet, agar pengembangan ke multi-outlet maupun multi-tenant di masa depan hanya memerlukan penambahan filter, bukan migrasi struktur ulang.

### 7.2 Entitas Utama (Ringkasan)

| Entitas | Keterangan Singkat |
|---|---|
| `outlets` | Data cabang/outlet cafe |
| `users` | Data pengguna sistem (kasir, manager, owner, staff) |
| `roles`, `permissions` | Tabel RBAC granular (mengikuti pola Spatie Permission) |
| `employees` | Data karyawan, relasi 1-1 dengan `users` untuk yang memiliki akun login |
| `products` | Daftar menu/produk yang dijual |
| `raw_materials` | Bahan baku |
| `product_recipes` | Pemetaan produk ke bahan baku dan jumlah pemakaian |
| `orders` | Transaksi penjualan (header) |
| `order_items` | Detail item per transaksi |
| `cashier_sessions` | Sesi buka/tutup kasir per shift |
| `stock_movements` | Riwayat pergerakan stok (in/out/adjustment) |
| `shifts` | Definisi jadwal shift kerja |
| `attendance_logs` | Riwayat absensi karyawan |
| `leave_requests` | Pengajuan cuti/izin |
| `payroll_periods` | Periode payroll (misal per bulan) |
| `payroll_records` | Slip gaji per karyawan per periode |
| `audit_logs` | Jejak audit aktivitas sensitif (login, perubahan data kritikal) |

### 7.3 Strategi Indexing

Index difokuskan ke kolom yang sering digunakan pada klausa `WHERE`, `JOIN`, dan `ORDER BY`, bukan ditambahkan secara berlebihan ke semua kolom (index berlebihan memperlambat operasi tulis):

- **B-Tree index** (default PostgreSQL) untuk kolom seperti `outlet_id`, `created_at`, `employee_id`, dan `status`, karena kolom-kolom ini paling sering menjadi filter laporan.
- **Composite index** untuk query yang menggabungkan dua kolom sekaligus, misal `(outlet_id, created_at)` untuk laporan penjualan per outlet per tanggal. Composite index jauh lebih efisien dibanding membuat dua index terpisah untuk kasus seperti ini.
- **Partial index** untuk kasus seperti pencarian order dengan status tertentu (misal `status = 'pending'`) — index hanya dibangun untuk baris yang relevan sehingga ukurannya lebih kecil dan pencariannya lebih cepat.
- Index dihindari pada kolom berkardinalitas rendah (misal kolom boolean), karena query planner PostgreSQL jarang menggunakannya secara efektif.

### 7.4 Strategi Pencarian Teks

Pencarian dengan pola `LIKE '%keyword%'` menyebabkan full table scan karena tanda `%` di awal pola membuat index B-Tree tidak dapat dimanfaatkan. Strategi yang diterapkan secara bertingkat sesuai kebutuhan:

1. Untuk pencarian dengan prefix yang pasti (misal kode invoice `INV-2026%`), pola `LIKE 'INV-2026%'` (tanpa `%` di awal) masih dapat memanfaatkan index biasa.
2. Untuk pencarian bebas di tengah kata (misal mencari nama karyawan "udi" dari "Budi"), digunakan ekstensi **`pg_trgm`** dengan **GIN index**, yang didesain khusus untuk pencarian substring cepat tanpa full scan.
3. Untuk pencarian produk/menu yang lebih kompleks (multi kata, toleran typo), digunakan **full-text search** PostgreSQL (`tsvector` + GIN index); jika skala data sudah sangat besar, dipertimbangkan layer pencarian terpisah seperti Meilisearch atau Elasticsearch.

### 7.5 Partitioning untuk Tabel Berskala Jutaan Baris

Tabel seperti `orders`, `order_items`, dan `attendance_logs` akan bertumbuh sangat cepat seiring waktu (setiap transaksi, setiap absensi). Strategi yang diterapkan:

- **Range partitioning berdasarkan bulan** pada kolom `created_at`, misalnya `orders_2026_06`, `orders_2026_07`, dan seterusnya. Query yang biasanya difilter per periode (laporan bulanan) otomatis hanya memindai partisi terkait, bukan seluruh histori data.
- Data lama (lebih dari 1–2 tahun) dapat diarsipkan ke tabel atau database terpisah (cold storage) agar tabel utama tetap ramping dan performa query tetap terjaga.

### 7.6 Optimasi Query

- Setiap perubahan terkait index/partisi diverifikasi menggunakan `EXPLAIN ANALYZE` sebelum dan sesudah optimasi, untuk memastikan index benar-benar digunakan oleh query planner, bukan sekadar asumsi.
- Query menghindari `SELECT *`; hanya kolom yang dibutuhkan yang diambil, terutama pada endpoint laporan yang dipanggil berulang.
- Laporan agregat berat (total penjualan bulanan, rekap payroll) disajikan melalui **materialized view** yang di-refresh terjadwal (misal tiap jam atau tiap hari), bukan dihitung ulang secara real-time setiap kali dashboard dibuka.
- **Connection pooling** (PgBouncer atau pooler bawaan penyedia database) digunakan agar jumlah koneksi database tidak membengkak saat banyak kasir/outlet mengakses sistem secara bersamaan.

### 7.7 Caching

- Data yang jarang berubah seperti daftar menu, kategori, dan harga disimpan di Redis dengan TTL (misal 10 menit), dan cache di-invalidate setiap kali ada perubahan dari sisi admin.
- Hasil query agregat untuk dashboard laporan berat disimpan di cache, bukan dieksekusi ulang ke database setiap kali halaman dirender.
- Session login dan rate limiting API disimpan di Redis, bukan di database, agar operasi baca-tulis kecil yang sangat sering tidak membebani PostgreSQL.

### 7.8 Strategi untuk Trafik Tinggi

- **Read replica**: laporan dan dashboard analitik membaca dari replica database, sementara modul POS (transaksi real-time) tetap menulis ke primary, sehingga beban laporan tidak mengganggu performa transaksi kasir.
- **Queue untuk proses berat**: generate payroll massal, ekspor laporan besar, dan pengiriman notifikasi massal dijalankan melalui job queue (Laravel Queue + Redis), bukan diproses langsung secara synchronous saat pengguna menekan tombol, agar request tidak timeout dan database tidak mengalami lonjakan beban mendadak.
- **Rate limiting per outlet/pengguna** diterapkan di level API untuk mencegah satu outlet membanjiri server dengan request berlebihan.

---

## 8. Desain API

### 8.1 Gaya API

API utama dibangun sebagai **RESTful API** menggunakan Laravel 13, dengan autentikasi berbasis token melalui **Laravel Sanctum**. Setiap response mengikuti format standar yang konsisten agar mudah dikonsumsi oleh frontend ReactJS (Vite):

```json
{
  "success": true,
  "data": { },
  "message": "Berhasil",
  "meta": { "page": 1, "per_page": 20, "total": 134 }
}
```

Untuk response error:

```json
{
  "success": false,
  "message": "Stok bahan baku tidak cukup",
  "errors": { "raw_material_id": ["Stok kopi arabika kurang dari kebutuhan resep"] }
}
```

### 8.2 Konvensi Endpoint (Contoh Representatif)

| Method | Endpoint | Keterangan | Role Minimum |
|---|---|---|---|
| POST | `/api/auth/login` | Login dan menerima token | Publik |
| POST | `/api/auth/logout` | Logout, invalidasi token | Semua role |
| GET | `/api/pos/products` | Daftar produk untuk kasir | cashier |
| POST | `/api/pos/orders` | Membuat transaksi baru | cashier |
| POST | `/api/pos/orders/sync` | Sinkronisasi batch transaksi offline | cashier |
| POST | `/api/pos/cashier-sessions/open` | Buka sesi kasir | cashier |
| POST | `/api/pos/cashier-sessions/close` | Tutup sesi kasir, hitung selisih kas | cashier |
| GET | `/api/inventory/raw-materials` | Daftar bahan baku & stok | manager |
| POST | `/api/inventory/stock-adjustments` | Penyesuaian stok manual | manager |
| GET | `/api/hr/shifts` | Daftar jadwal shift | manager |
| POST | `/api/hr/leave-requests` | Ajukan cuti | staff |
| PATCH | `/api/hr/leave-requests/{id}/approve` | Approve cuti | manager |
| POST | `/api/payroll/periods/{id}/generate` | Trigger generate payroll (job queue) | owner |
| GET | `/api/reports/sales?outlet_id=&from=&to=` | Laporan penjualan | manager/owner |
| GET | `/api/reports/sales/export?format=xlsx` | Ekspor laporan | manager/owner |

### 8.3 Idempotensi untuk Operasi Kritikal

Endpoint yang berpotensi dipanggil ulang akibat retry jaringan (terutama `/api/pos/orders/sync` dan `/api/payroll/periods/{id}/generate`) mewajibkan client mengirim `idempotency_key` unik per request. Server menyimpan key tersebut sementara dan menolak/mengembalikan hasil yang sama jika key yang sama dikirim ulang, untuk mencegah duplikasi transaksi atau duplikasi slip gaji.

### 8.4 Versioning

API menggunakan prefix versi pada URL (`/api/v1/...`) sejak awal, agar perubahan struktur API di masa depan tidak langsung memutus integrasi yang sudah berjalan (terutama penting untuk PWA POS yang mungkin masih menjalankan versi aplikasi lama di sisi klien karena belum sempat update).

### 8.5 Dokumentasi API

API didokumentasikan menggunakan OpenAPI/Swagger yang digenerate dari anotasi kode (misal melalui package `l5-swagger` untuk Laravel), sehingga dokumentasi selalu sinkron dengan implementasi aktual dan dapat diakses developer melalui endpoint `/api/documentation`.

### 8.6 Rate Limiting

Setiap endpoint dibatasi melalui rate limiting berbasis kombinasi user ID dan outlet ID (bukan hanya IP address, karena beberapa outlet bisa berada di belakang NAT/IP yang sama), dengan threshold berbeda untuk endpoint sensitif (misal `login` dibatasi lebih ketat dibanding `GET /products`).

---

## 9. Keamanan Sistem

Kebutuhan keamanan diberi kode `SEC-[NOMOR]`, mengacu pada prinsip umum OWASP Top 10.

| Kode | Kebutuhan |
|---|---|
| SEC-01 | Seluruh komunikasi antara klien dan server harus menggunakan HTTPS/TLS; HTTP biasa otomatis di-redirect ke HTTPS oleh Nginx. |
| SEC-02 | Kata sandi pengguna disimpan menggunakan algoritma hashing standar industri (bcrypt/Argon2), tidak pernah disimpan dalam bentuk plain text. |
| SEC-03 | Token autentikasi (Sanctum) memiliki masa berlaku terbatas dan mekanisme refresh, serta dapat dicabut (revoke) secara manual oleh admin jika perangkat hilang/dicuri. |
| SEC-04 | Setiap input dari pengguna divalidasi dan disanitasi di sisi server (tidak hanya sisi klien) untuk mencegah SQL Injection, XSS, dan mass assignment yang tidak diinginkan. |
| SEC-05 | Endpoint API menerapkan otorisasi berbasis permission granular di setiap request, bukan hanya pengecekan role di level UI. |
| SEC-06 | Data sensitif (gaji, data kependudukan karyawan) dienkripsi saat disimpan (encryption at rest) untuk kolom-kolom tertentu, minimal menggunakan enkripsi level kolom pada Laravel (`encrypted` cast). |
| SEC-07 | Sistem mencatat audit log untuk aktivitas sensitif: login/logout, perubahan data payroll, approval cuti, penyesuaian stok manual, dan perubahan role/permission pengguna. |
| SEC-08 | Sistem menerapkan rate limiting dan mekanisme lockout sementara setelah beberapa kali percobaan login gagal berturut-turut, untuk mencegah brute-force. |
| SEC-09 | Secret/credential (database password, API key pihak ketiga) disimpan melalui environment variable atau secret manager, tidak pernah di-commit ke source control. |
| SEC-10 | Dependensi pihak ketiga (npm package, composer package) diperiksa secara berkala terhadap known vulnerability (misal melalui `npm audit`, `composer audit`, atau Dependabot). |
| SEC-11 | Backup database dienkripsi dan disimpan di lokasi terpisah dari server produksi utama. |
| SEC-12 | Akses langsung ke container database dan Redis dari luar jaringan internal (publik) diblokir; hanya aplikasi backend dan reverse proxy yang dapat mengaksesnya melalui Docker network internal. |

---

## 10. Infrastruktur & Deployment (Docker)

### 10.1 Keputusan Containerization

Untuk skala saat ini (single-tenant, modular monolith), sistem **tidak memerlukan microservice terpisah-pisah**, namun **Docker tetap sangat disarankan** — bukan untuk kebutuhan microservice, melainkan untuk: konsistensi environment development vs production (versi PHP, Node, ekstensi PostgreSQL yang identik), mempermudah deployment (satu `docker-compose.yml` menjalankan seluruh layer: aplikasi Laravel, ReactJS, PostgreSQL, Redis, Nginx), dan mempermudah onboarding jika ada developer lain yang bergabung di kemudian hari.

Ringkasnya: **Docker = ya, untuk containerize setiap layer (app, db, cache, web server). Microservice = belum, biarkan modular monolith terlebih dahulu.**

### 10.2 Struktur Container

```
services:
  react-app       → POS PWA + Dashboard (ReactJS static via Nginx Alpine)
  laravel-api     → Backend utama (Laravel 13, PHP 8.4 FPM Alpine)
  laravel-worker  → Queue worker terpisah dari proses web (Laravel Queue)
  laravel-scheduler → Cron/scheduler untuk job terjadwal (refresh materialized view, reminder shift)
  postgres        → Database utama (PostgreSQL 16)
  postgres-replica → Read replica untuk laporan (opsional, aktif saat trafik mulai tinggi)
  redis           → Cache, queue broker, session store
  nginx           → Reverse proxy + TLS termination
```

### 10.3 Contoh Kerangka `docker-compose.yml` (Production)

```yaml
version: "3.9"

services:
  nginx:
    image: nginx:1.27-alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/certs:/etc/nginx/certs:ro
    depends_on:
      - react-app
      - laravel-api
    restart: unless-stopped

  react-app:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - VITE_API_URL=https://api.domain-kamu.com
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 64M

  laravel-api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - APP_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 256M

  laravel-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: php artisan queue:work --tries=3 --backoff=10
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  laravel-scheduler:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: php artisan schedule:work
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=cafe_management
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

Catatan: file ini adalah kerangka konsep untuk SRS, bukan file final siap pakai — environment variable, network policy, dan health check perlu dilengkapi saat implementasi sesuai kebutuhan keamanan pada Bagian 9.

### 10.4 Jaringan Docker (Networking)

- Seluruh service backend (Laravel, PostgreSQL, Redis) berada dalam satu **Docker network internal** yang tidak diekspos langsung ke publik.
- Hanya Nginx yang mengekspos port 80/443 ke luar; seluruh trafik ke `laravel-api` and `react-app` diteruskan melalui Nginx sebagai reverse proxy.
- Komunikasi `laravel-worker` dan `laravel-scheduler` ke `postgres` dan `redis` terjadi melalui network internal yang sama, tanpa melalui Nginx.

### 10.5 Strategi Build Image

- Setiap image dibangun menggunakan **multi-stage build** untuk meminimalkan ukuran image akhir (memisahkan stage build/compile dari stage runtime).
- Image untuk Laravel menggunakan basis PHP-FPM Alpine (PHP 8.4), dan image untuk ReactJS menggunakan multi-stage build Node 20 ke Nginx Alpine agar ukuran image runtime sangat kecil dan ringan.
- Setiap image diberi tag versi yang jelas (misal `cafe-api:1.2.0`), bukan hanya `latest`, agar proses rollback ke versi sebelumnya dapat dilakukan dengan cepat jika terjadi masalah pasca-deployment.

### 10.6 Environment Terpisah

| Environment | Tujuan | Catatan |
|---|---|---|
| Development | Pengembangan lokal | Menjalankan seluruh service via Docker Compose dengan hot-reload |
| Staging | Pengujian sebelum production | Konfigurasi semirip mungkin dengan production, data dummy/anonymized |
| Production | Lingkungan aktif digunakan outlet | Resource limit, monitoring, dan backup aktif penuh |

### 10.7 Strategi Deployment & Rollback

- Deployment menggunakan pendekatan **rebuild image → push ke registry → pull di server → restart container** secara terorkestrasi (dapat menggunakan CI/CD sederhana seperti GitHub Actions untuk build dan push image).
- Sebelum container lama dimatikan, container baru dijalankan dan dipastikan lolos health check terlebih dahulu (rolling update sederhana), untuk meminimalkan downtime saat deployment.
- Setiap deployment production didahului oleh migrasi database yang bersifat backward-compatible (migrasi tidak menghapus kolom/tabel yang masih dipakai versi sebelumnya secara langsung, melainkan melalui tahapan deprecation) untuk mendukung rollback yang aman.

### 10.8 Spesifikasi Server Minimum (Estimasi)

| Skala | CPU | RAM | Storage |
|---|---|---|---|
| 1 outlet | 2 vCPU | 4 GB | 40 GB SSD |
| 2–5 outlet | 4 vCPU | 8 GB | 80 GB SSD |
| 6+ outlet / trafik tinggi | 8 vCPU | 16 GB+ | 160 GB+ SSD, pertimbangkan read replica terpisah |

---

## 11. Observability, Logging, dan Monitoring

### 11.1 Logging

- Seluruh service (Laravel, ReactJS, Nginx) menulis log dalam format terstruktur (JSON) ke `stdout`/`stderr`, mengikuti praktik container-native logging, bukan menulis ke file lokal di dalam container.
- Log dikumpulkan secara terpusat menggunakan driver logging Docker (misal `json-file` dengan rotasi, atau diteruskan ke layanan agregasi log seperti Loki/ELK jika skala sudah membesar).
- Log aplikasi membedakan level severity (`debug`, `info`, `warning`, `error`, `critical`) agar memudahkan filtering saat troubleshooting.

### 11.2 Monitoring

- Setiap container menyediakan **health check endpoint** (`/health` untuk Laravel API, `/` untuk ReactJS) yang dicek secara berkala oleh orchestrator/reverse proxy.
- Metrik dasar yang dipantau: response time API, jumlah request per menit, tingkat error (4xx/5xx), penggunaan CPU/RAM per container, ukuran queue Redis (untuk mendeteksi job payroll/laporan yang menumpuk).
- Disarankan menggunakan stack monitoring ringan seperti Prometheus + Grafana, atau layanan managed (misal Better Stack/UptimeRobot untuk uptime check sederhana) sesuai kapasitas tim di fase awal.

### 11.3 Alerting

- Alert dikirim (misal via email/Telegram/Slack) ketika: tingkat error API melebihi ambang batas, job queue payroll gagal lebih dari N kali, stok bahan baku kritis (terhubung dengan FR-INV-05), atau ketersediaan sistem (uptime) terdeteksi turun.

---

## 12. Strategi Backup & Disaster Recovery

| Aspek | Strategi |
|---|---|
| Backup database | Backup penuh (full backup) harian dan incremental/WAL archiving berkala, disimpan terenkripsi di lokasi terpisah dari server utama (object storage seperti S3-compatible storage). |
| Retensi backup | Backup harian disimpan minimal 30 hari, backup bulanan disimpan minimal 12 bulan untuk kebutuhan audit/pajak. |
| Recovery Point Objective (RPO) | Maksimal kehilangan data 1 jam, dicapai melalui kombinasi WAL archiving dan backup berkala. |
| Recovery Time Objective (RTO) | Target waktu pulih maksimal 4 jam untuk skenario kegagalan server utama, dengan prosedur restore yang didokumentasikan dan diuji secara berkala. |
| Uji coba restore | Proses restore backup diuji secara berkala (misal setiap kuartal) di environment staging untuk memastikan backup benar-benar dapat dipulihkan, bukan hanya tersimpan. |
| Redundansi konfigurasi | File konfigurasi Docker Compose, environment variable (terenkripsi), dan skrip deployment disimpan di version control terpisah dari kode aplikasi sensitif jika diperlukan. |

---

## 13. Strategi Pengujian (Testing)

| Jenis Pengujian | Lingkup | Tools yang Disarankan |
|---|---|---|
| Unit Testing | Logika bisnis kritikal: kalkulasi payroll, pengurangan stok dari resep, perhitungan selisih kas | PHPUnit/Pest (Laravel), Vitest (ReactJS) |
| Integration Testing | Interaksi antar modul dan API endpoint | Pest/PHPUnit Feature Test, Postman/Newman |
| End-to-End Testing | Flow penuh pengguna: login → transaksi POS → cek laporan | Playwright/Cypress |
| Load Testing | Simulasi beban transaksi tinggi sesuai NFR-PERF-03 | k6 atau Apache JMeter |
| Security Testing | Pengecekan dasar terhadap OWASP Top 10 sebelum rilis production | OWASP ZAP, `composer audit`, `npm audit` |
| User Acceptance Testing (UAT) | Pengujian langsung oleh kasir/manager/owner di lingkungan staging sebelum go-live | Skenario manual berbasis kasus uji per FR |

Setiap kasus uji (test case) ditautkan ke kode kebutuhan fungsional (`FR-...`) pada Bagian 4 agar traceability terjaga — memudahkan verifikasi bahwa seluruh kebutuhan yang didokumentasikan benar-benar teruji sebelum rilis.

---

## 14. Rencana Pengembangan Bertahap (Roadmap)

| Fase | Lingkup | Output Utama |
|---|---|---|
| Fase 1 | Setup project: Docker, struktur folder modular, auth + RBAC dasar, modul POS minimal (jual, bayar, cetak struk) | POS dasar dapat digunakan untuk transaksi harian |
| Fase 2 | Inventory & resep produk (stok otomatis berkurang saat transaksi) | Stok bahan baku terpantau otomatis |
| Fase 3 | HR — shift, absensi, pengajuan cuti | Operasional kepegawaian terdigitalisasi |
| Fase 4 | Payroll — hitung gaji otomatis dari data absensi | Slip gaji otomatis tiap periode |
| Fase 5 | Reporting & dashboard owner, optimasi database (indexing, partitioning) setelah volume data mulai besar | Owner mendapat visibilitas penuh lintas outlet |
| Fase 6 | Hardening production: observability penuh (Bagian 11), backup terverifikasi (Bagian 12), load testing (Bagian 13) | Sistem benar-benar siap dan tervalidasi untuk production |
| Fase 7 (opsional, jika diperlukan) | Migrasi ke dukungan multi-tenant penuh | Sistem dapat dijual sebagai SaaS ke pemilik cafe lain |

---

## 15. Lampiran

### 15.1 Ringkasan Keputusan Arsitektur

| Aspek | Keputusan | Alasan Singkat |
|---|---|---|
| Tenancy | Single-tenant, skema siap multi-tenant | Hindari over-engineering di awal |
| Arsitektur backend | Modular monolith | Microservice belum diperlukan untuk skala saat ini |
| Containerization | Docker untuk seluruh layer | Konsistensi environment & kemudahan deployment, bukan untuk microservice |
| Database | PostgreSQL dengan indexing, partitioning, materialized view | Disiapkan untuk skala data jutaan baris |
| Pencarian teks | Hindari `LIKE '%x%'`, gunakan `pg_trgm`/full-text search | Performa query tetap cepat di skala besar |
| Caching | Redis untuk data statis & laporan berat | Mengurangi beban baca database |
| Trafik tinggi | Read replica + queue untuk job berat | Memisahkan beban transaksi vs laporan |
| Keamanan | TLS, hashing password, RBAC granular, audit log | Mengikuti praktik dasar OWASP Top 10 |
| Observability | Logging terstruktur + health check + alerting | Memastikan masalah terdeteksi sebelum berdampak besar ke operasional cafe |

### 15.2 Glosarium Tambahan

Lihat Bagian 1.3 untuk daftar istilah dan akronim utama yang digunakan di seluruh dokumen ini.

### 15.3 Riwayat Revisi Dokumen

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 30 Juni 2026 | Penyusunan SRS awal berdasarkan dokumentasi arsitektur proyek, dikembangkan menjadi spesifikasi lengkap siap production dengan Docker. |

---

*Dokumen ini bersifat hidup (living document) dan disarankan untuk diperbarui setiap kali ada perubahan signifikan pada kebutuhan, arsitektur, atau skala operasional sistem.*
