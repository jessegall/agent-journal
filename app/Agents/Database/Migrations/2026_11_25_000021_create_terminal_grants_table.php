<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('terminal_grants', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id', 64);
            $table->ulid('agent_id');
            $table->ulid('agent_runtime_id')->index();
            $table->ulid('agent_session_id');
            $table->unsignedInteger('process_generation');
            $table->ulid('host_id');
            // The read interest the grant was taken through; closing it ends the grant.
            $table->string('read_interest_id', 64);
            $table->string('take_id', 64);
            // The opaque id the host issued for the grant, the per-tab credential held only in browser memory.
            $table->string('grant_id', 64)->nullable()->unique();
            $table->string('state', 16);
            $table->unsignedInteger('next_sequence')->default(1);
            // The host requests that take and release the grant, whose reports settle it.
            $table->ulid('take_request_id')->nullable()->index();
            $table->ulid('release_request_id')->nullable()->index();
            $table->timestampTz('expires_at');
            $table->timestampsTz();
            $table->unique(['actor_type', 'actor_id', 'take_id']);
            $table->index(['agent_runtime_id', 'state']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('terminal_grants');
    }
};
