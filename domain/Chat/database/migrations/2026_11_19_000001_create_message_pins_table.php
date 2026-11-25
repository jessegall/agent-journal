<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message_pins', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->foreignUlid('inbox_id')->constrained('inboxes')->restrictOnDelete();
            $table->foreignUlid('message_id')->constrained('messages')->cascadeOnDelete();
            $table->timestampTz('pinned_at');
            $table->timestampsTz();

            $table->unique([
                'actor_type',
                'actor_id',
                'inbox_id',
                'message_id',
            ]);

            $table->index([
                'actor_type',
                'actor_id',
                'pinned_at',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_pins');
    }
};
