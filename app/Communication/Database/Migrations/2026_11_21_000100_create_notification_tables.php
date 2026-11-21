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
        Schema::create('notification_occurrences', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('occurrence_key', 191)->unique();
            $table->string('source_type', 32);
            $table->string('target_key', 64);
            $table->string('target_id', 64);
            $table->timestampTz('created_at')->nullable();
        });

        Schema::create('notification_scopes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('scope_key', 64);
            $table->string('recipient_type', 16);
            $table->string('recipient_id', 64);
            $table->unsignedBigInteger('next_sequence')->default(1);
            $table->unsignedBigInteger('mutation_version')->default(0);
            $table->unsignedInteger('unread_count')->default(0);
            $table->timestampTz('fenced_at')->nullable();
            $table->timestampsTz();

            $table->unique(['scope_key', 'recipient_type', 'recipient_id']);
        });

        Schema::create('notification_receipts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('occurrence_id')->constrained('notification_occurrences')->restrictOnDelete();
            $table->foreignUlid('scope_id')->constrained('notification_scopes')->restrictOnDelete();
            $table->unsignedBigInteger('sequence');
            $table->timestampTz('read_at')->nullable();
            $table->timestampTz('hidden_at')->nullable();
            $table->timestampTz('created_at')->nullable();

            $table->unique(['occurrence_id', 'scope_id']);
            $table->unique(['scope_id', 'sequence']);
        });

        DB::statement(<<<'SQL'
            CREATE INDEX notification_receipts_scope_unread ON notification_receipts (scope_id, sequence DESC)
                WHERE read_at IS NULL AND hidden_at IS NULL
            SQL);

        DB::statement(
            'ALTER TABLE notification_scopes ADD CONSTRAINT notification_scopes_sequence_positive '
                .'CHECK (next_sequence > 0)',
        );

        DB::statement(
            'ALTER TABLE notification_receipts ADD CONSTRAINT notification_receipts_sequence_positive '
                .'CHECK (sequence > 0)',
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_receipts');
        Schema::dropIfExists('notification_scopes');
        Schema::dropIfExists('notification_occurrences');
    }
};
