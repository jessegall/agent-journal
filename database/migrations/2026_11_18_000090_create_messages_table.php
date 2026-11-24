<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('inbox_id')->constrained('inboxes')->restrictOnDelete();
            $table->string('sender_type', 16);
            $table->string('sender_id', 64);
            $table->text('body');
            $table->unsignedInteger('number');
            $table->foreignUlid('target_message_id')->nullable()->constrained('messages')->restrictOnDelete();
            $table->timestampsTz();

            $table->index(['inbox_id', 'created_at', 'id']);
            $table->index('target_message_id');
            $table->unique(['inbox_id', 'number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
