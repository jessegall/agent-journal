<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agent_sessions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('agent_id')->index();
            $table->ulid('parent_session_id')->nullable()->index();
            $table->string('driver', 32)->nullable();
            $table->string('model', 128);
            $table->string('requested_model_type', 16);
            $table->string('requested_model', 128)->nullable();
            $table->string('driver_source', 16);
            $table->string('profile_key', 128);
            $table->unsignedInteger('profile_revision');
            $table->ulid('start_request_id')->index();
            $table->ulid('skill_generation_id')->nullable();
            $table->ulid('current_conversation_id')->nullable();
            $table->ulid('selected_message_id')->nullable();
            $table->ulid('job_source_message_id')->nullable();
            $table->string('status', 16)->default('active');
            $table->timestampTz('ended_at')->nullable();
            $table->timestampTz('last_heartbeat_at')->nullable();
            $table->timestampTz('silent_since')->nullable();
            $table->string('end_evidence')->nullable();
            $table->timestampTz('discovered_at')->nullable();
            $table->timestampsTz();

            $table->index(['status', 'last_heartbeat_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agent_sessions');
    }
};
