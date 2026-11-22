<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presentation_batches', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('interval_id')->constrained('inbox_intervals')->restrictOnDelete();
            $table->ulid('agent_session_id');
            $table->unsignedInteger('runtime_generation');
            $table->string('context_key');
            $table->foreignUlid('driver_turn_id')->nullable()->constrained('driver_turns')->nullOnDelete();
            $table->string('state', 16);
            $table->timestampTz('settled_at')->nullable();
            $table->timestampTz('dispatched_at');
            $table->timestampTz('last_progress_at');
            $table->timestampTz('lease_expires_at');
            $table->unsignedSmallInteger('attempt')->default(1);
            $table->timestampsTz();

            $table->index(['state', 'lease_expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presentation_batches');
    }
};
