# Design System - Sistem Manajemen Cafe

Dokumen ini mendefinisikan aturan desain visual, token warna, tipografi, dan komponen dasar untuk menjaga estetika premium, konsisten, dan berkinerja tinggi (terutama pada modul POS).

## Token Warna (Color Palette)

Sistem menggunakan tema warna hangat bernuansa kafe modern dengan opsi Light Mode (default dashboard) dan Dark Mode (sangat disarankan untuk kasir/POS guna mengurangi kelelahan mata).

### 1. Light Mode Tokens
- `--color-bg-base`: `#FBFBF9` (Warm milk white - warna latar belakang utama)
- `--color-bg-surface`: `#FFFFFF` (Putih murni - untuk card, table header)
- `--color-border`: `#E6E1DA` (Soft clay gray - border tipis)
- `--color-text-primary`: `#231F1D` (Dark espresso - teks utama)
- `--color-text-secondary`: `#6B6259` (Latte gray - deskripsi/label)

### 2. Dark Mode Tokens (Utama untuk `/pos` dan opsional untuk dashboard)
- `--color-bg-base`: `#131110` (Charcoal black - latar belakang)
- `--color-bg-surface`: `#1C1917` (Stone dark - card, keyboard kasir)
- `--color-border`: `#2E2A27` (Dark clay - border tipis)
- `--color-text-primary`: `#F5F2EB` (Warm cream - teks utama)
- `--color-text-secondary`: `#A1988F` (Muted latte - deskripsi/label)

### 3. Brand & Status Tokens (Berlaku global)
- `--color-primary`: `#8C6239` (Warm bronze/espresso - tombol utama, status aktif)
- `--color-primary-hover`: `#704D2B` (Darker bronze - hover effect)
- `--color-success`: `#3B7A57` (Sage green - stok aman, payroll disetujui, lunas)
- `--color-success-bg`: `#EBF5EE` (Light mode success background)
- `--color-danger`: `#B84A39` (Terracotta red - low stock, denda, reject cuti)
- `--color-danger-bg`: `#FAECE9` (Light mode danger background)
- `--color-warning`: `#D99B26` (Ochre amber - pending approval, status shift aktif)
- `--color-warning-bg`: `#FEF7E7` (Light mode warning background)

---

## Tipografi

- **Font Utama (Body & UI)**: `Inter`, sans-serif (untuk kejelasan teks kecil di tabel dan data nominal).
- **Font Judul (Headers)**: `Outfit`, sans-serif (memberikan kesan modern dan premium pada visual grafik/dashboard).
- **Aturan Penggunaan**:
  - `h1`: 32px (Outfit, Semi-Bold, Line-height: 1.2)
  - `h2`: 24px (Outfit, Semi-Bold, Line-height: 1.3)
  - `h3`: 18px (Outfit, Medium, Line-height: 1.4)
  - `body-regular`: 14px (Inter, Regular, Line-height: 1.5)
  - `body-small` (label/helper): 12px (Inter, Medium, Line-height: 1.4)
  - `tabular-nums` (nominal/angka): Wajib menggunakan utilitas CSS `font-variant-numeric: tabular-nums` pada seluruh angka nominal transaksi agar sejajar saat dibaca dalam baris vertikal.

---

## Border Radius Rule (Aturan Sudut)

Sistem menggunakan gaya **Mixed Rounded** untuk estetika premium modern:
- **Card, Tabel, dan Panel Kontainer**: `8px` (`0.5rem`) - memberikan struktur kokoh.
- **Tombol & Input Field**: `12px` (`0.75rem`) - lebih membulat untuk interaksi jari yang nyaman (terutama di POS tablet).
- **Badge Status & Mini Button**: `24px` (`1.5rem`) - fully rounded pill style.
- **Table Cell Highlight**: `4px` (`0.25rem`) - radius minimal.

---

## Spacing Scale (Skala Spasi)

Menggunakan basis 4px grid system untuk konsistensi margin dan padding:
- `space-xs`: `4px`
- `space-sm`: `8px`
- `space-md`: `16px`
- `space-lg`: `24px`
- `space-xl`: `32px`
- `space-xxl`: `48px`

---

## Aturan Komponen Dasar

1. **Buttons**:
   - *Primary*: Background `--color-primary`, teks putih/cream. Tanpa gradient, hover transition `0.2s ease-in-out` ke `--color-primary-hover`.
   - *Secondary*: Outline `--color-border`, background transparent, teks `--color-text-primary`.
   - *Danger*: Background `--color-danger`, teks putih.
   - *Disabled*: Background soft gray, teks muted, cursor `not-allowed`.
2. **Input Fields**:
   - Border `1px solid --color-border`. Pada status `:focus-visible`, border berubah menjadi `--color-primary` dengan outline tipis (focus ring) `--color-primary` dengan opacity 15%.
   - Padding internal minimal `10px 14px` agar mudah di-tap kasir.
3. **Cards & Tables**:
   - Gunakan border tipis `1px solid --color-border` sebagai pembatas utama.
   - Hindari shadow tebal. Gunakan flat layout untuk mempercepat proses render di browser tablet POS yang berspesifikasi rendah.

---

## Larangan Visual Eksplisit

1. **Dilarang menggunakan Gradient Kasar**: Hindari penggunaan warna gradient pelangi/terlalu kontras pada background atau tombol. Pertahankan solid warm colors.
2. **Dilarang menggunakan Drop Shadow Tebal**: Shadow hanya diizinkan secara sangat halus (`box-shadow: 0 4px 12px rgba(0,0,0,0.05)`) pada modal popup atau dropdown menu. Card biasa dan table harus bertipe flat.
3. **Dilarang menggunakan Emoji di UI utama**: Jangan gunakan emoji (misal: ☕, 💰, 📅) sebagai icon navigasi atau label tombol. Gunakan icon monokromatik dari library icon profesional (seperti Lucide React).
4. **Dilarang menggunakan Warna Neon/Saturasi Tinggi**: Warna primer atau status tidak boleh menggunakan warna dasar browser yang terlalu terang (seperti murni `#FF0000` atau `#00FF00`). Gunakan variasi warna yang telah ditentukan di atas.
