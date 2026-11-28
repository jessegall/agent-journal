<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('retry_attempts', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->ulid('agent_runtime_id')->index();
            $table->ulid('driver_request_id')->nullable();
            $table->ulid('host_process_id')->nullable();
            $table->string('action', 24);
            $table->unsignedInteger('attempt_version')->nullable();
            $table->unsignedSmallInteger('retry');
            $table->unsignedSmallInteger('wait_seconds');
            $table->text('failure');
            $table->text('evidence')->nullable();
            $table->timestampTz('retry_at');
            $table->string('outcome', 16)->nullable();
            $table->timestampsTz();

            $table->unique(['driver_request_id', 'attempt_version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('retry_attempts');
    }
};
