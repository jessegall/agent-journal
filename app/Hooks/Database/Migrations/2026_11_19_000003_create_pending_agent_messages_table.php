<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pending_agent_messages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('hook_id', 128);
            $table->text('text');
            $table->timestampsTz();

            $table->index(['actor_type', 'actor_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pending_agent_messages');
    }
};
