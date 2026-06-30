<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_shift_schedule_id')->nullable()
                ->constrained('employee_shift_schedules')->nullOnDelete();
            $table->timestamp('clock_in_at')->nullable();
            $table->timestamp('clock_out_at')->nullable();
            $table->decimal('clock_in_lat', 10, 7)->nullable();
            $table->decimal('clock_in_lng', 10, 7)->nullable();
            $table->decimal('clock_out_lat', 10, 7)->nullable();
            $table->decimal('clock_out_lng', 10, 7)->nullable();
            $table->enum('verification_method', ['geofence', 'qr_code', 'manual'])->default('qr_code');
            $table->boolean('is_late')->default(false);
            $table->unsignedInteger('late_minutes')->default(0);
            $table->enum('status', ['present', 'late', 'absent', 'on_leave'])->default('present');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['outlet_id', 'employee_id', 'clock_in_at']);
            // partial index dapat ditambahkan lewat raw SQL bila perlu, contoh untuk status late:
            // CREATE INDEX attendance_late_idx ON attendance_logs (employee_id) WHERE status = 'late';
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_logs');
    }
};
