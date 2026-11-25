<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_cleanups', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('start_request_id')->unique();
            $table->ulid('agent_session_id');
            $table->ulid('host_id')->index();
            $table->json('removed_steps');
            $table->string('recovery_location', 1024)->nullable();
            $table->text('last_error')->nullable();
            $table->string('state', 16)->index();
            $table->unsignedInteger('attempts')->default(0);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_cleanups');
    }
};
