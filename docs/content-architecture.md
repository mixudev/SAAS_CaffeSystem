# Content & Data Architecture - Sistem Manajemen Cafe

Dokumen ini mendefinisikan bagaimana konten dan data disimpan, dikelola, serta dialirkan antar komponen sistem, lengkap dengan definisi skema data utama dan aturan penulisan copy.

## Strategi Penyimpanan Data

Sistem membagi penyimpanan data menjadi empat layer utama:

1. **Persistent Database (PostgreSQL 16)**:
   - Sumber kebenaran tunggal (Single Source of Truth) untuk seluruh data transaksional, master data, kepegawaian, dan konfigurasi.
   - Menggunakan pemisahan logic *read-heavy* (membaca laporan dari database replica) dan *write-heavy* (menulis transaksi ke database primary).

2. **In-Memory Cache (Redis 7)**:
   - Menyimpan data statis/master yang jarang berubah (seperti daftar produk, kategori menu, detail resep) dengan TTL (Time-To-Live) tertentu.
   - Digunakan untuk rate-limiting API, session login token, dan cache visual dashboard laporan berat.

3. **Client-Side Cache & Offline Storage (IndexedDB & LocalStorage)**:
   - Digunakan pada modul kasir ReactJS (`/pos`) untuk menyimpan daftar produk aktif secara lokal agar POS dapat dibuka dalam kondisi offline.
   - Menyimpan antrian transaksi lokal (`offline_orders_queue`) saat koneksi terputus.

4. **Static Assets (Storage Server/S3-Compatible)**:
   - Gambar produk, avatar karyawan, dan berkas PDF slip gaji yang diekspor disimpan di file storage terpisah, bukan di database (database hanya menyimpan URL reference).

---

## Skema Data Utama (Main Data Models & Types)

Representasi tipe data utama dalam format TypeScript yang wajib diikuti di sisi frontend ReactJS dan disesuaikan dengan skema tabel migration Eloquent di Laravel:

### 1. User & Employee Profile
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];           // e.g., ['manager']
  permissions: string[];     // e.g., ['inventory.adjust', 'hr.leave.approve']
  created_at: string;
}

interface Employee {
  id: number;
  user_id: number | null;    // null jika staf tidak memiliki akses login
  outlet_id: number;
  employee_code: string;     // e.g., EMP-0091
  full_name: string;
  phone: string;
  identity_number: string;   // NIK (Enkripsi tingkat kolom / Encrypted cast)
  base_salary: number;       // Gaji pokok per bulan/jam (Encrypted cast)
  status: 'active' | 'inactive';
}
```

### 2. Product & Recipe
```typescript
interface Product {
  id: number;
  outlet_id: number;         // Mempersiapkan multi-tenant/outlet
  name: string;
  sku: string;               // Stock Keeping Unit unik
  price: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
}

interface RawMaterial {
  id: number;
  outlet_id: number;
  name: string;
  sku: string;
  stock_quantity: number;
  unit: 'gr' | 'ml' | 'pcs' | 'pack'; // Satuan terkecil
  low_stock_threshold: number;        // Batas stok minimum untuk alert
}

interface ProductRecipe {
  product_id: number;
  raw_material_id: number;
  usage_quantity: number;    // Jumlah pemakaian bahan baku per satu unit produk
}
```

### 3. Transactions (Order & OrderItem)
```typescript
interface Order {
  id: number;
  outlet_id: number;
  cashier_id: number;        // user_id kasir
  invoice_number: string;    // e.g., INV-20260630-001
  total_amount: number;      // Total kotor
  discount_amount: number;
  tax_amount: number;
  net_amount: number;        // Total bersih setelah diskon + pajak
  payment_method: 'cash' | 'card' | 'qris_manual';
  payment_status: 'paid' | 'refunded' | 'pending';
  idempotency_key: string;   // Mencegah duplikasi transaksi offline-to-online
  created_at: string;
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;        // Harga beli per unit saat transaksi terjadi
  subtotal: number;
}
```

### 4. HR Attendance & Shifts
```typescript
interface Shift {
  id: number;
  outlet_id: number;
  name: string;              // e.g., Shift Pagi, Shift Malam
  start_time: string;        // HH:mm:ss
  end_time: string;          // HH:mm:ss
}

interface AttendanceLog {
  id: number;
  employee_id: number;
  outlet_id: number;
  shift_id: number;
  work_date: string;         // YYYY-MM-DD
  clock_in: string | null;   // Timestamp masuk
  clock_out: string | null;  // Timestamp keluar
  status: 'present' | 'late' | 'absent' | 'leave';
  latitude: number | null;   // Geofencing verification
  longitude: number | null;
}
```

---

## Aturan Penulisan Copy (Copywriting Rules)

1. **Bahasa Antarmuka**: Seluruh tulisan label, tombol, placeholder, tooltip, dan instruksi pada UI menggunakan **Bahasa Indonesia yang baku, sopan, namun modern**.
2. **Pesan Kesalahan (Error Messages)**:
   - Harus ramah pengguna (*user-friendly*) dan *actionable* (memberikan solusi).
   - **Dilarang keras menampilkan error SQL mentah** atau *stack trace* backend ke UI.
   - Contoh Salah: `SQLSTATE[23505]: Unique violation: 7 ERROR: duplicate key value...`
   - Contoh Benar: `Nama produk sudah terdaftar. Silakan gunakan nama produk lain.`
3. **Pemberitahuan & Alert**:
   - Status Sukses: Menggunakan kalimat aktif pendek. Contoh: `Data berhasil disimpan.`
   - Status Bahaya/Kritis: Contoh: `Stok kopi espresso kritis! Segera lakukan restock.`
4. **Data Nominal & Format Keuangan**:
   - Wajib menggunakan format rupiah standar Indonesia. Contoh: `Rp 25.000` (menggunakan pemisah ribuan titik, tanpa desimal sen `.00` kecuali diminta khusus oleh finance).
   - Format tanggal menggunakan standar Indonesia untuk UI: `30 Juni 2026`.
