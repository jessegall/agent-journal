<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipt_progress', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('receipt_id')->constrained('message_receipts')->cascadeOnDelete();
            $table->string('context_key');
            $table->unsignedInteger('confirmed_offset')->default(0);
            $table->timestampsTz();

            $table->unique(['receipt_id', 'context_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipt_progress');
    }
};
