<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('idempotency_keys', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // dikirim klien (SRS 8.3)
            $table->string('endpoint');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedSmallInteger('response_status')->nullable();
            $table->json('response_snapshot')->nullable(); // hasil response asli untuk dikembalikan ulang
            $table->timestamps();

            $table->index(['endpoint', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('idempotency_keys');
    }
};
