<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('driver_switches', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('request_id')->unique();
            $table->foreignUlid('agent_id')->constrained('agents');
            $table->ulid('expected_session_id');
            $table->unsignedInteger('expected_generation');
            $table->string('driver', 32);
            $table->string('variant', 16);
            $table->ulid('account_id');
            $table->unsignedBigInteger('account_revision');
            $table->ulid('conversation_id')->nullable();
            $table->boolean('save_variant')->default(false);
            $table->string('requested_by', 64);
            $table->ulid('replacement_session_id')->nullable();
            $table->string('stage', 24);
            // The source runtime's observation sequence when its stop was accepted; only a later one proves it runs.
            $table->unsignedBigInteger('stop_boundary_sequence')->nullable();
            $table->string('failure_reason', 255)->nullable();
            $table->timestampsTz();
        });

        DB::statement("create unique index driver_switches_one_open on driver_switches (agent_id) where stage not in ('refused', 'confirmed', 'launch_failed', 'cancelled')");
    }

    public function down(): void
    {
        Schema::dropIfExists('driver_switches');
    }
};
