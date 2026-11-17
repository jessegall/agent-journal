<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agent_stacks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('session_id');
            $table->unsignedBigInteger('version')->default(1);
            $table->jsonb('frames');
            $table->string('status', 16)->default('active');
            $table->timestampTz('closed_at')->nullable();
            $table->timestampsTz();

            $table->unique(['agent_id', 'session_id']);
            $table->index(['status', 'closed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agent_stacks');
    }
};
