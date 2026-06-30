<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_record_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_record_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['allowance', 'deduction', 'bonus', 'overtime', 'penalty']);
            $table->string('label'); // contoh: "Tunjangan Transport", "Potongan BPJS Kesehatan"
            $table->decimal('amount', 14, 2);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['payroll_record_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_record_items');
    }
};
