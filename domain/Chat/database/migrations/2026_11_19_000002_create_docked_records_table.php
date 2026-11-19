<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('docked_records', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->foreignUlid('source_inbox_id')->constrained('inboxes')->restrictOnDelete();
            $table->foreignUlid('destination_inbox_id')->constrained('inboxes')->restrictOnDelete();
            $table->string('record_type', 64);
            $table->string('record_id');
            $table->timestampTz('docked_at');
            $table->timestampTz('hidden_at')->nullable();
            $table->timestampsTz();

            $table->unique(
                ['actor_type', 'actor_id', 'source_inbox_id', 'destination_inbox_id', 'record_type', 'record_id'],
                'docked_records_owner_pair_record_unique',
            );
            $table->index(['actor_type', 'actor_id', 'hidden_at', 'docked_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('docked_records');
    }
};
