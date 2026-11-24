<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('inbox_id')->constrained('inboxes')->cascadeOnDelete();
            $table->string('source_type', 64);
            $table->string('source_id', 64);
            $table->string('type', 16);
            $table->unsignedInteger('group_number');
            $table->string('author_type', 16);
            $table->string('author_id', 64);
            $table->timestampsTz();

            $table->unique(['source_type', 'source_id']);
            $table->index(['inbox_id', 'created_at', 'id']);
            $table->index(['inbox_id', 'group_number']);
        });
    }
};
