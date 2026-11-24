<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message_reads', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('message_id')->constrained('messages')->cascadeOnDelete();
            $table->string('reader_type', 16);
            $table->string('reader_id', 64);
            $table->timestampTz('read_at');
            $table->timestampTz('last_read_at');

            $table->unique(['message_id', 'reader_type', 'reader_id']);
            $table->index(['reader_type', 'reader_id', 'last_read_at', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_reads');
    }
};
