<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Migration OPSIONAL — dijalankan ketika volume data orders mulai besar (lihat SRS 7.5
 * dan roadmap Fase 5/6). PostgreSQL native declarative partitioning dilakukan melalui
 * raw SQL karena Laravel Schema Builder belum mendukungnya secara native.
 *
 * PENTING: Mengubah tabel biasa menjadi partitioned table TIDAK bisa dilakukan dengan
 * ALTER TABLE langsung jika tabel sudah berisi data dalam jumlah besar. Strategi yang aman:
 * 1. Buat tabel baru `orders_partitioned` dengan struktur sama + PARTITION BY RANGE (created_at)
 * 2. Buat partisi bulanan (orders_y2026m06, orders_y2026m07, dst)
 * 3. Migrasikan data lama secara bertahap (batch insert) di luar jam sibuk
 * 4. Swap nama tabel (RENAME) saat downtime singkat terjadwal
 *
 * Migration ini hanya menyiapkan KERANGKA pembuatan partisi baru ke depan
 * (dijalankan manual/terjadwal, bukan otomatis pada `migrate` biasa) agar tidak
 * mengganggu instalasi awal sistem yang masih berskala kecil.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }

        // Contoh fungsi helper untuk membuat partisi bulanan baru pada tabel orders
        // setelah orders dikonversi menjadi partitioned table (dieksekusi manual via DBA/ops,
        // TIDAK dijalankan otomatis di sini untuk menghindari downtime tak terduga saat deploy awal).
        DB::statement(<<<'SQL'
            CREATE OR REPLACE FUNCTION create_monthly_partition(table_name text, target_date date)
            RETURNS void AS $$
            DECLARE
                partition_name text;
                start_date date;
                end_date date;
            BEGIN
                start_date := date_trunc('month', target_date);
                end_date := start_date + interval '1 month';
                partition_name := table_name || '_y' || to_char(start_date, 'YYYY') || 'm' || to_char(start_date, 'MM');

                EXECUTE format(
                    'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
                    partition_name, table_name, start_date, end_date
                );
            END;
            $$ LANGUAGE plpgsql;
        SQL);
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('DROP FUNCTION IF EXISTS create_monthly_partition(text, date)');
    }
};
