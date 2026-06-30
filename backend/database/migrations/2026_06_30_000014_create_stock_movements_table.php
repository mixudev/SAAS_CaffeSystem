<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('raw_material_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['in', 'out', 'adjustment']);
            $table->decimal('quantity', 14, 3); // positif untuk 'in', negatif untuk 'out'/penyesuaian turun
            $table->decimal('balance_after', 14, 3); // saldo stok setelah pergerakan ini (audit trail)
            $table->string('reference_type')->nullable(); // order, stock_purchase, manual_adjustment
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('reason')->nullable(); // wajib diisi untuk adjustment (FR-INV-04)
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['outlet_id', 'raw_material_id', 'created_at'], 'stock_movements_outlet_material_date_idx');
            $table->index(['reference_type', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
