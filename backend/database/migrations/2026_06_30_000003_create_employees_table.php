<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->string('employee_code')->unique();
            $table->string('full_name');
            // data sensitif - dienkripsi di level model (cast 'encrypted'), kolom tetap string/text di DB
            $table->text('nik')->nullable(); // nomor induk kependudukan, encrypted cast di model
            $table->text('address')->nullable(); // encrypted cast di model
            $table->string('phone')->nullable();
            $table->date('birth_date')->nullable();
            $table->date('hire_date');
            $table->date('termination_date')->nullable();
            $table->string('position')->nullable();
            $table->enum('employment_type', ['full_time', 'part_time', 'contract'])->default('full_time');
            $table->enum('wage_type', ['hourly', 'monthly', 'shift'])->default('monthly');
            $table->decimal('base_wage', 14, 2)->default(0); // per jam/bulan/shift tergantung wage_type
            $table->text('bank_account')->nullable(); // encrypted cast di model
            $table->unsignedSmallInteger('annual_leave_quota')->default(12);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['outlet_id', 'is_active']);
        });

        // tambahkan kolom employee_id ke users setelah tabel employees ada
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('employee_id')->nullable()->after('id')
                ->constrained('employees')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('employee_id');
        });
        Schema::dropIfExists('employees');
    }
};
