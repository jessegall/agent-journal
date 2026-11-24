<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('inbox_id')->constrained('inboxes')->restrictOnDelete();
            $table->text('body');
            $table->foreignUlid('target_message_id')->nullable()->constrained('messages')->restrictOnDelete();
            $table->timestampsTz();

            $table->index(['inbox_id', 'created_at', 'id']);
            $table->index('target_message_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
