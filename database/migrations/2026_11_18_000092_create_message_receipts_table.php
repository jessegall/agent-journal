<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message_receipts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('message_id')->constrained('messages')->restrictOnDelete();
            $table->foreignUlid('interval_id')->constrained('inbox_intervals')->restrictOnDelete();
            $table->timestampTz('presented_at')->nullable();
            $table->timestampsTz();

            $table->unique(['message_id', 'interval_id']);
            $table->index(['interval_id', 'presented_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_receipts');
    }
};
