<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_reads', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('agent_id');
            $table->ulid('session_id');
            $table->string('skill_key', 64);
            $table->string('evidence', 32);
            $table->timestampTz('read_at');

            $table->index('agent_id');
            $table->index(['session_id', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_reads');
    }
};
