<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Migration ini mengimplementasikan strategi pencarian teks pada SRS bagian 7.4:
 * - pg_trgm + GIN index untuk pencarian substring cepat (nama karyawan, produk)
 * - tsvector + GIN index untuk full-text search nama/deskripsi produk
 *
 * CATATAN: hanya berjalan pada driver PostgreSQL. Pada driver lain (mis. sqlite untuk
 * testing lokal) migration akan dilewati (no-op) agar test suite tetap dapat berjalan.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');

        // GIN trigram index untuk pencarian substring nama karyawan & nama produk
        DB::statement('CREATE INDEX IF NOT EXISTS employees_full_name_trgm_idx ON employees USING GIN (full_name gin_trgm_ops)');
        DB::statement('CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON products USING GIN (name gin_trgm_ops)');

        // Kolom tsvector untuk full-text search produk (multi kata, mendekati typo-tolerant)
        DB::statement("ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector
            GENERATED ALWAYS AS (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(description, ''))) STORED");
        DB::statement('CREATE INDEX IF NOT EXISTS products_search_vector_idx ON products USING GIN (search_vector)');

        // Partial index: pencarian order dengan status pending/refund saja (SRS 7.3 partial index)
        DB::statement("CREATE INDEX IF NOT EXISTS orders_pending_payment_idx ON orders (outlet_id, created_at)
            WHERE payment_status IN ('refunded', 'partial_refund')");

        // Partial index untuk leave_requests yang masih pending (sering difilter manager)
        DB::statement("CREATE INDEX IF NOT EXISTS leave_requests_pending_idx ON leave_requests (outlet_id, created_at)
            WHERE status = 'pending'");
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('DROP INDEX IF EXISTS leave_requests_pending_idx');
        DB::statement('DROP INDEX IF EXISTS orders_pending_payment_idx');
        DB::statement('DROP INDEX IF EXISTS products_search_vector_idx');
        DB::statement('ALTER TABLE products DROP COLUMN IF EXISTS search_vector');
        DB::statement('DROP INDEX IF EXISTS products_name_trgm_idx');
        DB::statement('DROP INDEX IF EXISTS employees_full_name_trgm_idx');
    }
};
