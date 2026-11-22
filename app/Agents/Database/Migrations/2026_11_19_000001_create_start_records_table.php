<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('start_records', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('request_id')->unique();
            $table->ulid('agent_id')->index();
            $table->string('actor_type', 16);
            $table->string('actor_id', 64);
            $table->string('driver_key', 128);
            $table->string('driver_label', 64)->nullable();
            $table->string('family', 64)->nullable();
            $table->unsignedInteger('protocol_version')->nullable();
            $table->string('driver_build', 64)->nullable();
            $table->ulid('host_id')->nullable();
            $table->unsignedInteger('proposed_generation')->nullable();
            $table->ulid('binding_id')->nullable();
            $table->unsignedInteger('catalogue_revision')->nullable();
            $table->string('model', 128);
            $table->string('requested_model_type', 16);
            $table->string('requested_model', 128)->nullable();
            $table->string('driver_source', 16);
            $table->string('profile_key', 128)->nullable();
            $table->unsignedInteger('profile_revision')->nullable();
            $table->string('origin_type', 16);
            $table->string('owner_reference', 128)->nullable()->index();
            $table->string('context_reference', 128)->nullable();
            $table->string('conversation_mode', 16);
            $table->string('mode', 16)->default('headless');
            $table->string('mode_intent', 16)->default('inherit');
            $table->boolean('account_chosen')->default(false);
            $table->boolean('remember')->default(false);
            $table->string('conversation_target', 200)->nullable();
            $table->boolean('conversation_resumed')->nullable();
            $table->string('payload_digest', 64);
            $table->string('disposition', 16);
            $table->string('refusal_reason', 48)->nullable();
            $table->timestampTz('refused_at')->nullable();
            $table->ulid('session_id')->nullable()->index();
            $table->foreignUlid('reply_inbox_id')->nullable()->constrained('inboxes')->restrictOnDelete();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('start_records');
    }
};
