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
            'ALTER TABLE notification_receipts ADD CONSTRAINT notification_receipts_sequence_positive '
                .'CHECK (sequence > 0)',
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_receipts');
    }
};
