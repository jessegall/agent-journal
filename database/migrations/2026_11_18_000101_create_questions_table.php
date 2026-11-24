<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('inbox_id')->constrained('inboxes')->restrictOnDelete();
            $table->string('sender_type', 16);
            $table->string('sender_id', 64);
            $table->string('target_type', 16);
            $table->string('target_id', 64);
            $table->text('text');
            $table->string('type', 16);
            $table->jsonb('options');
            $table->text('answer')->nullable();
            $table->timestampTz('answered_at')->nullable();
            $table->timestampsTz();

            $table->index(['inbox_id', 'created_at', 'id']);
            $table->index(['target_type', 'target_id', 'answered_at']);
        });
    }
};
