# Tech Stack - Sistem Manajemen Cafe

Dokumen ini mendefinisikan stack teknologi, pembatasan penggunaan library, struktur direktori, dan konvensi penamaan untuk memandu agen AI dalam menulis kode secara konsisten.

## Daftar Teknologi Utama

### 1. Backend API
- **Framework**: Laravel 13.x (PHP 8.4)
- **Autentikasi**: Laravel Sanctum (Token-based authentication)
- **Job Queue**: Laravel Queue dengan Redis driver
- **Task Scheduling**: Laravel Scheduler (untuk tugas background berkala)
- **Database Driver**: PostgreSQL 16 (melalui Eloquent ORM)

### 2. Frontend App
- **Framework**: ReactJS 19.x (Vite, Node 20)
- **Language**: TypeScript (strict mode)
- **Offline Storage**: IndexedDB (via `localforage` atau API browser native) + LocalStorage untuk PWA POS
- **State Management**: React Context API / Zustand (pilih salah satu yang ringan, hindari Redux yang terlalu kompleks)
- **HTTP Client**: Axios (dengan interceptors untuk menangani refresh token)

### 3. Database & Caching
- **Primary Database**: PostgreSQL 16 (dukungan partitioning, composite index, full-text search, pg_trgm)
- **Cache & Queue Broker**: Redis 7.x

### 4. Infrastruktur & DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy / TLS**: Nginx 1.27 (sebagai entrypoint tunggal)

---

## Library & Praktik yang DILARANG

1. **Dilarang menggunakan Microservices**: Seluruh domain backend (POS, Inventory, HR, Payroll, Reporting) **wajib** berada di dalam satu project Laravel (**Modular Monolith**). Jangan membuat service/container backend terpisah per modul.
2. **Dilarang Akses Database Langsung dari ReactJS**: ReactJS hanya boleh berkomunikasi dengan database melalui REST API Laravel. ReactJS dilarang menggunakan ORM (Prisma/Drizzle) untuk langsung terhubung ke PostgreSQL.
3. **Dilarang menggunakan CSS Framework Berat (Ad-hoc)**: Hindari penggunaan UI library berbasis runtime berat jika memperlambat POS. Gunakan Vanilla CSS atau Tailwind CSS (Tailwind CSS v3.x/v4.x diizinkan jika dikonfigurasi dengan purge css aktif untuk optimasi bundle size).
4. **Dilarang mengabaikan Otorisasi di API**: Jangan mengandalkan proteksi halaman di frontend ReactJS saja. Setiap API endpoint di Laravel wajib dilindungi oleh middleware otorisasi (RBAC granular).

---

## Struktur Folder Project

Sistem menggunakan repositori tunggal (monorepo) dengan pembagian folder yang tegas:

```text
/ (root)
├── backend/                       # Project Laravel 13 (API)
│   ├── app/
│   │   ├── Modules/               # Batasan modul/domain tegas
│   │   │   ├── Auth/              # Controllers, Services, Models, Requests
│   │   │   ├── POS/
│   │   │   ├── Inventory/
│   │   │   ├── HR/
│   │   │   ├── Payroll/
│   │   │   └── Reporting/
│   │   └── Providers/
│   │       └── ModuleServiceProvider.php # Registrasi routes & migrations per modul
│   ├── config/
│   ├── database/
│   │   ├── migrations/            # Migrasi global/lintas-modul
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php                # Jalur masuk API utama (mendelegasikan ke modul)
│   ├── Dockerfile
│   └── ...
├── frontend/                      # Project ReactJS (Vite)
│   ├── src/
│   │   ├── pages/                 # Halaman aplikasi React
│   │   │   ├── auth/              # Login, Reset Password
│   │   │   ├── pos/               # Halaman kasir POS (Offline-first)
│   │   │   ├── admin/             # Dashboard Manager Outlet
│   │   │   ├── owner/             # Dashboard Owner
│   │   │   ├── hr/                # Dashboard HR (Shift, cuti, absensi)
│   │   │   └── payroll/           # Dashboard Payroll & Finance
│   │   ├── components/            # UI Components
│   │   │   ├── common/            # Button, Input, Modal, Table, Alert
│   │   │   └── layouts/           # Sidebar, Header, POSLayout
│   │   ├── lib/                   # API client, database offline (IndexedDB)
│   │   ├── hooks/                 # Custom React hooks (e.g., useOfflineSync)
│   │   ├── types/                 # TypeScript interfaces/types
│   │   ├── App.tsx                # Konfigurasi Routing (React Router)
│   │   └── main.tsx               # Entry point React
│   ├── public/                    # Aset statis & manifest.json untuk PWA
│   ├── Dockerfile
│   ├── index.html                 # Entry point HTML untuk Vite
│   ├── vite.config.ts             # Konfigurasi Vite
│   └── ...
├── docker-compose.yml             # Orkestrasi container dev/prod
└── nginx/                         # Konfigurasi Nginx
    └── conf.d/
        └── default.conf
```

---

## Konvensi Penamaan (Naming Conventions)

### 1. Database & Eloquent
- **Nama Tabel**: `snake_case` jamak (e.g., `attendance_logs`, `leave_requests`).
- **Nama Kolom**: `snake_case` (e.g., `outlet_id`, `clock_in_time`).
- **Nama Model**: `PascalCase` tunggal (e.g., `AttendanceLog`, `LeaveRequest`).
- **Primary Key**: Harus selalu `id` (bigint auto-increment) atau UUID jika diperlukan, namun untuk tabel transaksi cepat gunakan auto-increment demi indeksasi cepat.
- **Foreign Key**: `singula_table_name_id` (e.g., `outlet_id`, `user_id`).

### 2. Backend (Laravel API)
- **Controllers**: `PascalCase` berakhiran `Controller` (e.g., `OrderController.php`).
- **Services (Business Logic)**: `PascalCase` berakhiran `Service` (e.g., `PayrollCalculationService.php`).
- **Requests (Validation)**: `PascalCase` berakhiran `Request` (e.g., `CreateOrderRequest.php`).
- **Routes**: `kebab-case` untuk URI path (e.g., `/api/v1/stock-adjustments`).

### 3. Frontend (ReactJS + Vite)
- **Routing Pages**: Menggunakan React Router DOM. Berkas halaman diletakkan di `src/pages` dengan penamaan `PascalCase` atau `kebab-case` folder (e.g., `src/pages/hr/leave-requests.tsx`).
- **Components**: `PascalCase` (e.g., `TransactionCard.tsx`, `PrimaryButton.tsx`).
- **Hooks**: `camelCase` diawali kata `use` (e.g., `useOfflineSync.ts`).
- **Types / Interfaces**: `PascalCase` tanpa awalan `I` (e.g., `OrderData`, `EmployeeProfile`).
- **API Payloads**: Mengikuti format JSON dari API Laravel (`snake_case` untuk keys).
