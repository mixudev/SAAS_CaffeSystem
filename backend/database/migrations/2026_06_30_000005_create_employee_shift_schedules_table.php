<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_shift_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('shift_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->enum('status', ['scheduled', 'completed', 'absent', 'on_leave', 'cancelled'])
                ->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['employee_id', 'date'], 'employee_schedule_unique_per_day');
            $table->index(['outlet_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_shift_schedules');
    }
};
