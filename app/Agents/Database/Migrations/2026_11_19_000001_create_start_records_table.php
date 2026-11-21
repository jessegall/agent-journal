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
            $table->string('driver', 32);
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
            $table->string('variant', 16)->default('headless');
            $table->boolean('account_chosen')->default(false);
            $table->boolean('saves_variant')->default(false);
            $table->string('conversation_target', 200)->nullable();
            $table->boolean('conversation_resumed')->nullable();
            $table->string('payload_digest', 64);
            $table->string('disposition', 16);
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
