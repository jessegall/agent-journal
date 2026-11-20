<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stop_attempts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('agent_id');
            $table->ulid('session_id');
            $table->string('stop_id', 128);
            $table->string('policy_digest', 64);
            $table->unsignedInteger('workspace_generation');
            $table->json('condition_hashes');
            $table->string('state', 16);
            $table->string('submission_digest', 64)->nullable();
            $table->timestampTz('certified_at')->nullable();
            $table->timestampsTz();

            $table->unique(['session_id', 'stop_id']);
        });

        Schema::create('stop_results', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('stop_attempt_id')->constrained('stop_attempts')->cascadeOnDelete();
            $table->string('condition_key', 64);
            $table->string('definition_hash', 64);
            $table->string('status', 16);
            $table->timestampTz('started_at');
            $table->timestampTz('ended_at')->nullable();
            $table->integer('exit_code')->nullable();
            $table->string('signal', 16)->nullable();
            $table->string('summary', 2048);
            $table->text('output')->nullable();
            $table->boolean('truncated');
            $table->timestampsTz();

            $table->unique(['stop_attempt_id', 'condition_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stop_results');
        Schema::dropIfExists('stop_attempts');
    }
};
