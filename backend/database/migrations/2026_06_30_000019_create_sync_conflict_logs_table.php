<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sync_conflict_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->uuid('offline_uuid')->nullable();
            $table->string('conflict_type'); // mis. stock_mismatch, duplicate_order, price_changed
            $table->json('details')->nullable(); // payload klien vs kondisi server saat konflik terjadi
            $table->boolean('is_resolved')->default(false);
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['outlet_id', 'is_resolved']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sync_conflict_logs');
    }
};
