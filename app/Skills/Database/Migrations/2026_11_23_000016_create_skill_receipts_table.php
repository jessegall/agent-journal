<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_receipts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('session_id');
            $table->unsignedInteger('context_epoch');
            $table->string('skill_key', 64);
            $table->string('content_digest', 64);
            $table->string('evidence', 32);
            $table->timestampTz('read_at');

            $table->unique(['session_id', 'context_epoch', 'skill_key', 'content_digest']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_receipts');
    }
};
