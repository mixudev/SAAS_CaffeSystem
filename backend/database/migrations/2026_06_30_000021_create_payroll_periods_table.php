<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->nullable()->constrained()->nullOnDelete(); // null = mencakup seluruh outlet
            $table->string('name'); // contoh: Payroll Juni 2026
            $table->date('period_start');
            $table->date('period_end');
            $table->enum('status', ['draft', 'processing', 'pending_approval', 'approved', 'paid'])
                ->default('draft');
            $table->timestamp('generated_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['period_start', 'period_end']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_periods');
    }
};
