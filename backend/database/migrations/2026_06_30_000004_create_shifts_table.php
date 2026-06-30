<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // contoh: Shift Pagi, Shift Sore
            $table->time('start_time');
            $table->time('end_time');
            $table->unsignedSmallInteger('tolerance_minutes')->default(10); // toleransi sebelum dianggap telat
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['outlet_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
