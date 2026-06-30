<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_category_id')->nullable()
                ->constrained('product_categories')->nullOnDelete();
            $table->string('sku')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 14, 2);
            $table->string('image_path')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active']);
        });
        // Kolom tsvector + GIN index untuk full-text search nama produk (lihat SRS 7.4 poin 3)
        // ditambahkan terpisah di migration 2026_06_30_000026_add_search_indexes.php
        // agar migration ini tetap portable dan tidak gagal di driver non-PostgreSQL.
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
