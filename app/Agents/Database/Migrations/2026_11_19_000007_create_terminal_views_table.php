<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('terminal_views', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id', 64);
            $table->ulid('agent_runtime_id')->index();
            $table->unsignedInteger('process_generation');
            $table->unsignedInteger('interval_ms');
            $table->timestampTz('expires_at');
            $table->timestampTz('closed_at')->nullable();
            $table->timestampsTz();
            $table->index(['actor_type', 'actor_id', 'closed_at']);
            $table->index(['closed_at', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('terminal_views');
    }
};
