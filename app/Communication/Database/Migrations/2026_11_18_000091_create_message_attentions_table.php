<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message_attentions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('origin_type', 16);
            $table->ulid('origin_id');
            $table->foreignUlid('origin_receipt_id')->constrained('command_receipts')->restrictOnDelete();
            $table->foreignUlid('inbox_id')->constrained('inboxes')->restrictOnDelete();
            $table->string('actor_type', 16);
            $table->string('actor_id', 64);
            $table->string('request_id', 64)->nullable();
            $table->unsignedBigInteger('wake_sequence')->nullable();
            $table->timestampsTz();

            $table->unique(['origin_type', 'origin_id', 'actor_type', 'actor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_attentions');
    }
};
