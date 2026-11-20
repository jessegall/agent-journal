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
        Schema::create('messages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->ulid('source_inbox_id');
            $table->ulid('destination_inbox_id');
            $table->string('sender_type', 16);
            $table->string('sender_id', 64);
            $table->ulid('sender_session_id')->nullable();
            $table->ulid('conversation_id')->index();
            $table->text('body');
            $table->boolean('is_question')->default(false);
            $table->string('state', 32);
            $table->unsignedBigInteger('state_version')->default(0);
            $table->timestampTz('read_at')->nullable();
            $table->string('read_by_type', 16)->nullable();
            $table->string('read_by_id', 64)->nullable();
            $table->ulid('read_participation_assignment_id')->nullable();
            $table->ulid('origin_receipt_id');
            $table->ulid('reply_to_id')->nullable();
            $table->ulid('answer_message_id')->nullable()->unique();
            $table->string('closed_by_type', 16)->nullable();
            $table->string('closed_by_id', 64)->nullable();
            $table->timestampTz('closed_at')->nullable();
            $table->string('dismissal_type', 16)->nullable();
            $table->text('dismissal_reason')->nullable();
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);
            $table->index(['destination_inbox_id', 'state', 'created_at', 'id']);
            $table->index(['destination_inbox_id', 'read_at', 'created_at', 'id']);
            $table->index(['source_inbox_id', 'created_at', 'id']);
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->foreign('source_inbox_id')->references('id')->on('inboxes')->restrictOnDelete();
            $table->foreign('destination_inbox_id')->references('id')->on('inboxes')->restrictOnDelete();
            $table->foreign('origin_receipt_id')->references('id')->on('command_receipts')->restrictOnDelete();
            $table->foreign('reply_to_id')->references('id')->on('messages')->restrictOnDelete();
            $table->foreign('answer_message_id')->references('id')->on('messages')->restrictOnDelete();
        });

        DB::statement('ALTER TABLE messages ADD CONSTRAINT messages_number_positive CHECK (number > 0)');
        DB::statement(<<<'SQL'
            ALTER TABLE messages ADD CONSTRAINT messages_read_audit_whole CHECK (
                (read_at IS NULL AND read_by_type IS NULL AND read_by_id IS NULL
                    AND read_participation_assignment_id IS NULL)
                OR (read_at IS NOT NULL AND read_by_type IS NOT NULL AND read_by_id IS NOT NULL
                    AND read_participation_assignment_id IS NOT NULL)
            )
            SQL);

        Schema::create('chat_selections', function (Blueprint $table) {
            $table->ulid('session_id')->primary();
            $table->ulid('message_id');
            $table->timestampTz('selected_at');
        });

        Schema::create('chat_job_sources', function (Blueprint $table) {
            $table->ulid('session_id')->primary();
            $table->ulid('message_id');
            $table->timestampTz('captured_at');
        });
        DB::statement(<<<'SQL'
            ALTER TABLE messages ADD CONSTRAINT messages_answered_names_answer CHECK (
                state <> 'answered' OR answer_message_id IS NOT NULL
            )
            SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE messages ADD CONSTRAINT messages_dismissed_names_closer CHECK (
                state <> 'dismissed'
                OR (closed_by_id IS NOT NULL AND dismissal_reason IS NOT NULL AND btrim(dismissal_reason) <> '')
            )
            SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_job_sources');
        Schema::dropIfExists('chat_selections');
        Schema::dropIfExists('messages');
    }
};
