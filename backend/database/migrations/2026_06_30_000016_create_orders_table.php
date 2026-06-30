<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Catatan partitioning (SRS 7.5):
     * Tabel ini adalah kandidat utama untuk range partitioning bulanan berdasarkan created_at
     * (mis. orders_2026_06, orders_2026_07, dst) ketika volume data sudah besar.
     * Migration Laravel standar tidak mendukung native partitioning PostgreSQL secara langsung,
     * sehingga setup partisi dilakukan lewat migration raw SQL terpisah
     * (lihat 2026_06_30_000027_partition_orders_table.php) yang dijalankan SETELAH
     * volume data mulai signifikan, agar tidak menambah kompleksitas di fase awal pengembangan.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('cashier_session_id')->nullable()
                ->constrained('cashier_sessions')->nullOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // kasir yang membuat transaksi
            $table->string('order_number')->unique();

            $table->string('customer_name')->nullable();
            $table->decimal('subtotal', 14, 2);
            $table->decimal('discount', 14, 2)->default(0);
            $table->decimal('tax', 14, 2)->default(0);
            $table->decimal('total', 14, 2);

            $table->enum('payment_method', ['cash', 'card', 'qris', 'other'])->default('cash');
            $table->enum('payment_status', ['paid', 'refunded', 'partial_refund'])->default('paid');
            $table->enum('order_status', ['completed', 'cancelled', 'refunded'])->default('completed');

            // dukungan offline-first (FR-POS-07, FR-POS-08)
            $table->boolean('is_offline_created')->default(false);
            $table->uuid('offline_uuid')->nullable()->unique(); // dibuat di klien saat offline
            $table->timestamp('synced_at')->nullable();
            $table->boolean('has_sync_conflict')->default(false);

            // idempotensi untuk endpoint sync (SRS 8.3)
            $table->string('idempotency_key')->nullable()->unique();

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->index(['outlet_id', 'created_at'], 'orders_outlet_created_idx'); // composite, untuk laporan per outlet per tanggal
            $table->index(['outlet_id', 'order_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
