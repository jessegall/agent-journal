<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipt_deliveries', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('receipt_id')->unique()->constrained('message_receipts')->restrictOnDelete();
            $table->string('notification_key')->unique();
            $table->string('state', 16);
            $table->unsignedSmallInteger('attempts')->default(0);
            $table->timestampTz('next_attempt_at')->nullable();
            $table->timestampTz('lease_expires_at')->nullable();
            $table->string('last_failure')->nullable();
            $table->timestampsTz();

            $table->index(['state', 'next_attempt_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipt_deliveries');
    }
};
