<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('raw_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('unit'); // kg, g, l, ml, pcs, dll
            $table->decimal('current_stock', 14, 3)->default(0);
            $table->decimal('min_stock_threshold', 14, 3)->default(0); // FR-INV-05
            $table->decimal('cost_per_unit', 14, 2)->default(0); // untuk COGS, rata-rata berjalan
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['outlet_id', 'name']);
            $table->index(['outlet_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('raw_materials');
    }
};
