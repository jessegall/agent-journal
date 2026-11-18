<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A message between two actors (doc 27 revision 5, section 7): its envelope names the sending and the receiving actor,
 * never a session (rule 37); a reply points at the message it answers, and its read, answer and dismissal are kept on
 * the row. A sender's submission key makes a resent message the same message.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->text('body');
            $table->string('state', 32);
            $table->string('sender_type', 16);
            $table->string('sender_id', 26);
            $table->string('recipient_type', 16);
            $table->string('recipient_id', 26);
            $table->foreignUlid('reply_to_id')->nullable()->constrained('messages')->restrictOnDelete();
            $table->foreignUlid('answer_message_id')->nullable()->unique()->constrained('messages')->restrictOnDelete();
            $table->timestampTz('read_at')->nullable();
            $table->string('closed_by_type', 16)->nullable();
            $table->string('closed_by_id', 26)->nullable();
            $table->timestampTz('closed_at')->nullable();
            $table->string('dismissal_type', 16)->nullable();
            $table->text('dismissal_reason')->nullable();
            $table->ulid('wake_request_id')->nullable();
            $table->unsignedBigInteger('wake_sequence')->nullable();
            $table->uuid('submission_key');
            $table->string('submission_hash', 64);
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);
            $table->unique(['sender_type', 'sender_id', 'submission_key']);
            $table->index(['recipient_type', 'recipient_id', 'read_at', 'created_at', 'id']);
            $table->index(['sender_type', 'sender_id', 'created_at', 'id']);
            $table->index(['recipient_type', 'recipient_id', 'state', 'created_at', 'id']);
            $table->index('reply_to_id');
        });

        DB::statement('ALTER TABLE messages ADD CONSTRAINT messages_number_positive CHECK (number > 0)');
        DB::statement("ALTER TABLE messages ADD CONSTRAINT messages_recipient_not_system CHECK (recipient_type <> 'system')");
        DB::statement("ALTER TABLE messages ADD CONSTRAINT messages_answered_has_answer CHECK ("
            ."(state = 'answered') = (answer_message_id IS NOT NULL))");
        DB::statement("ALTER TABLE messages ADD CONSTRAINT messages_dismissal_complete CHECK ("
            ."state <> 'dismissed' OR (closed_by_type IS NOT NULL AND closed_by_id IS NOT NULL"
            .' AND closed_at IS NOT NULL AND dismissal_reason IS NOT NULL))');
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
