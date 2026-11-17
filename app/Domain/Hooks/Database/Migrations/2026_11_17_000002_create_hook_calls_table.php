<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hook_calls', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('session_id');
            $table->string('event_id', 128);
            $table->char('input_digest', 64);
            $table->jsonb('answer');
            $table->jsonb('steps');
            $table->timestampsTz();

            $table->unique(['agent_id', 'session_id', 'event_id']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hook_calls');
    }
};
