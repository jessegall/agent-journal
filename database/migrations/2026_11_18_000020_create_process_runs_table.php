<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('process_runs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('admission_id', 64)->unique();
            $table->string('mode', 16);
            $table->string('project_key', 64);
            $table->string('actor_type', 16)->nullable();
            $table->string('actor_id')->nullable();
            $table->string('source_digest', 64);
            $table->string('dialect', 8);
            $table->string('tree_digest', 64);
            $table->string('registry_revision', 64);
            $table->string('policy_revision', 64);
            $table->string('lifecycle', 16);
            $table->string('capture_state', 16);
            $table->string('stop_reason')->nullable();
            $table->string('stale_reason')->default('');
            $table->unsignedBigInteger('update_sequence')->default(0);
            $table->string('event_key_hash', 64)->default('');
            $table->string('consuming_key_hash', 64)->default('');
            $table->string('working_folder')->default('');
            $table->jsonb('plan')->default('{}');
            $table->timestampTz('consumed_at')->nullable();
            $table->timestampTz('heartbeat_at')->nullable();
            $table->timestampTz('started_at')->nullable();
            $table->timestampTz('ended_at')->nullable();
            $table->string('request_intent', 32)->default('explicit_request');
            $table->string('responsible_type', 16)->nullable();
            $table->string('responsible_id', 64)->nullable();
            $table->string('outcome_user_id', 64)->nullable();
            $table->ulid('attempt_id')->unique();
            $table->timestampsTz();

            $table->index(['project_key', 'actor_type', 'actor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('process_runs');
    }
};
