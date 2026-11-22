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
        Schema::create('notification_scopes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('scope_key', 64);
            $table->string('recipient_type', 16);
            $table->string('recipient_id', 64);
            $table->unsignedBigInteger('next_sequence')->default(1);
            $table->unsignedBigInteger('mutation_version')->default(0);
            $table->unsignedInteger('unread_count')->default(0);
            $table->timestampTz('fenced_at')->nullable();
            $table->unsignedBigInteger('mark_all_through')->nullable();
            $table->unsignedBigInteger('mark_all_after')->default(0);
            $table->timestampsTz();

            $table->unique(['scope_key', 'recipient_type', 'recipient_id']);
        });

        DB::statement(
            'ALTER TABLE notification_scopes ADD CONSTRAINT notification_scopes_sequence_positive '
                .'CHECK (next_sequence > 0)',
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_scopes');
    }
};
