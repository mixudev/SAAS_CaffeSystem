# API Contracts - Sistem Manajemen Cafe

Dokumen ini mendefinisikan kontrak API RESTful versi 1 (`/api/v1`), format payload request/response, skema autentikasi, serta daftar endpoint utama.

## Protokol Umum

- **Base URL Prefix**: `/api/v1`
- **Autentikasi**: Laravel Sanctum via header `Authorization: Bearer <TOKEN>` (kecuali endpoint login).
- **Format Header**: `Accept: application/json`, `Content-Type: application/json`
- **Idempotensi**: Operasi tulis kritikal (sync transaksi POS, generate payroll) wajib mengirim header `X-Idempotency-Key: <UUID>` guna mencegah eksekusi ganda akibat gangguan koneksi.

---

## Standar Response Format

### 1. Success Response (200 OK / 201 Created)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "invoice_number": "INV-20260630-001"
  },
  "message": "Transaksi berhasil disimpan.",
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 1
  }
}
```

### 2. Validation Error Response (422 Unprocessable Entity)
```json
{
  "success": false,
  "message": "Input tidak valid.",
  "errors": {
    "raw_material_id": [
      "Stok arabika espresso kurang dari kebutuhan resep."
    ]
  }
}
```

### 3. Client/Server Error Response (400 Bad Request / 401 Unauthorized / 403 Forbidden / 404 Not Found / 500 Internal Server Error)
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke modul Payroll."
}
```

---

## Daftar Endpoint Utama

### 1. Modul Autentikasi

#### Login
- **Method & URL**: `POST /api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "email": "kasir@caffe.com",
    "password": "password123"
  }
  ```
- **Response Data (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "token": "1|sanctum_generated_token_string",
      "user": {
        "id": 1,
        "name": "Budi Kasir",
        "email": "kasir@caffe.com",
        "roles": ["cashier"],
        "permissions": ["pos.checkout", "pos.session.manage"]
      }
    },
    "message": "Login berhasil."
  }
  ```

#### Logout
- **Method & URL**: `POST /api/v1/auth/logout`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Response Data (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logout berhasil. Token dihapus."
  }
  ```

---

### 2. Modul POS (Point of Sale)

#### Ambil Daftar Produk (Offline Caching)
- **Method & URL**: `GET /api/v1/pos/products`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Response Data (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 101,
        "name": "Iced Cafe Latte",
        "sku": "PRD-LAT-001",
        "price": 28000,
        "category": "Coffee",
        "image_url": "https://storage.caffe.com/products/latte.jpg",
        "is_active": true
      }
    ],
    "message": "Daftar produk berhasil diambil."
  }
  ```

#### Buat Transaksi Baru (Online/Normal)
- **Method & URL**: `POST /api/v1/pos/orders`
- **Headers**: `Authorization: Bearer <TOKEN>`, `X-Idempotency-Key: <UUID>`
- **Request Body**:
  ```json
  {
    "outlet_id": 1,
    "total_amount": 28000,
    "discount_amount": 0,
    "tax_amount": 2800,
    "net_amount": 30800,
    "payment_method": "cash",
    "items": [
      {
        "product_id": 101,
        "quantity": 1,
        "unit_price": 28000,
        "subtotal": 28000
      }
    ]
  }
  ```
- **Response Data (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "order_id": 9901,
      "invoice_number": "INV-20260630-9901",
      "payment_status": "paid",
      "created_at": "2026-06-30T09:45:00Z"
    },
    "message": "Transaksi berhasil disimpan."
  }
  ```

#### Sinkronisasi Batch Transaksi Offline
- **Method & URL**: `POST /api/v1/pos/orders/sync`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Request Body**:
  ```json
  {
    "orders": [
      {
        "idempotency_key": "unique-uuid-1",
        "outlet_id": 1,
        "total_amount": 28000,
        "discount_amount": 0,
        "tax_amount": 2800,
        "net_amount": 30800,
        "payment_method": "cash",
        "created_at": "2026-06-30T08:15:00Z",
        "items": [
          {
            "product_id": 101,
            "quantity": 1,
            "unit_price": 28000,
            "subtotal": 28000
          }
        ]
      }
    ]
  }
  ```
- **Response Data (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "synced_count": 1,
      "conflicts": [] // Daftar transaction uuid yang bermasalah (jika ada)
    },
    "message": "Sinkronisasi selesai."
  }
  ```

#### Sesi Kasir (Buka/Tutup Sesi)
- **Buka Sesi**: `POST /api/v1/pos/cashier-sessions/open`
  - **Request Body**: `{ "outlet_id": 1, "opening_cash": 500000 }`
- **Tutup Sesi**: `POST /api/v1/pos/cashier-sessions/close`
  - **Request Body**: `{ "session_id": 45, "closing_cash_physical": 1280000 }`
  - **Response (200 OK)**: Menghasilkan selisih kas (reconciliation metrics).

---

### 3. Modul Inventory

#### Stock Adjustments (Penyesuaian Stok Manual)
- **Method & URL**: `POST /api/v1/inventory/stock-adjustments`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Request Body**:
  ```json
  {
    "outlet_id": 1,
    "raw_material_id": 5,
    "adjustment_type": "subtraction", // 'addition' | 'subtraction'
    "quantity": 250,                  // e.g., 250 gram
    "reason": "Bahan baku tumpah / rusak"
  }
  ```
- **Response Data (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Penyesuaian stok berhasil disimpan."
  }
  ```

---

### 4. Modul HR

#### Ajukan Cuti/Izin
- **Method & URL**: `POST /api/v1/hr/leave-requests`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Request Body**:
  ```json
  {
    "leave_type": "annual",          // 'annual' | 'sick' | 'special'
    "start_date": "2026-07-05",
    "end_date": "2026-07-07",
    "reason": "Urusan keluarga"
  }
  ```

#### Approval Cuti (Hanya Manager/Owner)
- **Method & URL**: `PATCH /api/v1/hr/leave-requests/{id}/approve`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Request Body**:
  ```json
  {
    "status": "approved", // 'approved' | 'rejected'
    "reject_reason": ""  // Diwajibkan jika status 'rejected'
  }
  ```

---

### 5. Modul Payroll

#### Trigger Generate Payroll
- **Method & URL**: `POST /api/v1/payroll/periods/{id}/generate`
- **Headers**: `Authorization: Bearer <TOKEN>`, `X-Idempotency-Key: <UUID>`
- **Response Data (202 Accepted)**:
  ```json
  {
    "success": true,
    "message": "Proses generate payroll sedang diproses di background queue."
  }
  ```

---

### 6. Modul Reporting

#### Laporan Penjualan (Dashboard)
- **Method & URL**: `GET /api/v1/reports/sales?outlet_id=1&from=2026-06-01&to=2026-06-30`
- **Headers**: `Authorization: Bearer <TOKEN>` (Membaca dari Read Replica database)
- **Response Data (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "total_sales": 75000000,
      "transaction_count": 1420,
      "average_transaction": 52816,
      "daily_sales": [
        { "date": "2026-06-01", "revenue": 2400000 },
        { "date": "2026-06-02", "revenue": 2550000 }
      ]
    },
    "message": "Laporan penjualan berhasil diambil."
  }
  ```
