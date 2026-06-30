<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete(); // kasir
            $table->foreignId('approved_by')->constrained('users')->cascadeOnDelete(); // manager (FR-POS-09)
            $table->decimal('amount', 14, 2);
            $table->text('reason');
            $table->timestamp('refunded_at');
            $table->timestamps();

            $table->index(['order_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_refunds');
    }
};
