<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('raw_material_id')->constrained()->cascadeOnDelete();
            $table->decimal('quantity', 14, 3);
            $table->decimal('purchase_price_per_unit', 14, 2);
            $table->decimal('total_price', 14, 2);
            $table->date('purchased_at');
            $table->string('invoice_number')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['outlet_id', 'raw_material_id', 'purchased_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_purchases');
    }
};
