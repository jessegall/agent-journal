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
            $table->text('body');
            $table->string('state', 32)->default('sent');
            $table->ulid('agent_id')->nullable();
            $table->ulid('session_id')->nullable();
            $table->timestampsTz();

            $table->index(['agent_id', 'session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
