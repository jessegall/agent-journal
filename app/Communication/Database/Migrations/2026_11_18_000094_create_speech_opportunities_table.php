<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('speech_opportunities', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('inbox_id')->constrained('inboxes')->restrictOnDelete();
            $table->foreignUlid('user_root_id')->constrained('messages')->restrictOnDelete();
            $table->string('actor_type', 16);
            $table->string('actor_id', 64);
            $table->foreignUlid('interval_id')->constrained('inbox_intervals')->restrictOnDelete();
            $table->string('state', 16);
            $table->foreignUlid('reserved_question_id')->nullable()->constrained('messages')->restrictOnDelete();
            $table->unsignedInteger('lease_version')->default(0);
            $table->char('claim_token_digest', 64)->nullable();
            $table->timestampTz('lease_expires_at')->nullable();
            $table->foreignUlid('contribution_message_id')
                ->nullable()
                ->unique()
                ->constrained('messages')
                ->restrictOnDelete();
            $table->timestampsTz();

            $table->unique(['user_root_id', 'actor_type', 'actor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('speech_opportunities');
    }
};
