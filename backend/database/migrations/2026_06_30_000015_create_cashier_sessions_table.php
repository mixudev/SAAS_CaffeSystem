<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cashier_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // kasir
            $table->decimal('opening_cash', 14, 2);
            $table->decimal('closing_cash_system', 14, 2)->nullable(); // total kas dihitung sistem
            $table->decimal('closing_cash_actual', 14, 2)->nullable(); // diinput kasir saat tutup sesi
            $table->decimal('cash_difference', 14, 2)->nullable(); // selisih (actual - system)
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['outlet_id', 'status']);
            $table->index(['user_id', 'opened_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cashier_sessions');
    }
};
