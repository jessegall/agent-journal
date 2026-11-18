<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agent_runtimes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('agent_session_id')->unique();
            $table->ulid('host_id')->index();
            $table->string('driver_type', 16);
            $table->string('program', 32);
            $table->string('program_build', 64);
            $table->string('profile', 64);
            $table->text('canonical_folder');
            $table->string('activity', 32);
            $table->string('hold_reason', 32);
            $table->string('requested_model')->nullable();
            $table->string('staged_model')->nullable();
            $table->string('observed_model')->nullable();
            $table->string('requested_effort', 32)->nullable();
            $table->string('staged_effort', 32)->nullable();
            $table->string('observed_effort', 32)->nullable();
            $table->timestampTz('settings_observed_at')->nullable();
            $table->text('launch_grant')->nullable();
            $table->unsignedInteger('process_generation')->default(0);
            $table->timestampTz('last_observed_at')->nullable();
            $table->unsignedInteger('row_version')->default(1);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agent_runtimes');
    }
};
