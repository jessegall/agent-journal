<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message_reactions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->foreignUlid('inbox_id')->constrained('inboxes')->restrictOnDelete();
            $table->foreignUlid('message_id')->constrained('messages')->cascadeOnDelete();
            $table->string('emoji', 16);
            $table->timestampsTz();

            $table->unique(['actor_type', 'actor_id', 'message_id', 'emoji']);
            $table->index('message_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_reactions');
    }
};
