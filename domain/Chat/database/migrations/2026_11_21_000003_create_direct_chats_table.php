<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('direct_chats', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('conversation_id')->unique()->constrained('conversations')->cascadeOnDelete();
            $table->string('environment_key');
            $table->string('low_actor');
            $table->string('high_actor');
            $table->timestampsTz();

            $table->unique(['environment_key', 'low_actor', 'high_actor']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('direct_chats');
    }
};
