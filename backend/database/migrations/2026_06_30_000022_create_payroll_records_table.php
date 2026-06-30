<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_period_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();

            $table->decimal('base_salary', 14, 2)->default(0);
            $table->decimal('total_work_hours', 8, 2)->default(0);
            $table->decimal('overtime_hours', 8, 2)->default(0);
            $table->decimal('overtime_amount', 14, 2)->default(0);
            $table->decimal('allowances_total', 14, 2)->default(0);
            $table->decimal('bonus_total', 14, 2)->default(0);
            $table->decimal('late_penalty_total', 14, 2)->default(0);
            $table->decimal('deductions_total', 14, 2)->default(0); // BPJS, pinjaman, dll (akumulasi)
            $table->decimal('gross_salary', 14, 2)->default(0);
            $table->decimal('net_salary', 14, 2)->default(0);

            $table->enum('status', ['draft', 'approved', 'paid'])->default('draft');
            $table->string('slip_pdf_path')->nullable();
            $table->timestamps();

            $table->unique(['payroll_period_id', 'employee_id'], 'payroll_record_unique_per_period');
            $table->index(['outlet_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_records');
    }
};
