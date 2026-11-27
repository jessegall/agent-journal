<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('host_driver_images', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('host_id')->constrained('hosts')->cascadeOnDelete();
            $table->foreignUlid('driver_image_recipe_id')->constrained('driver_image_recipes');
            $table->string('status', 16);
            $table->unsignedInteger('attempt')->default(0);
            // Recoveries failed one after another, across build instructions; only a ready image resets it.
            $table->unsignedInteger('failures')->default(0);
            $table->ulid('build_instruction_id')->nullable();
            $table->ulid('allow_instruction_id')->nullable();
            $table->ulid('check_instruction_id')->nullable();
            $table->string('image')->nullable();
            $table->text('refusal')->nullable();
            $table->timestampTz('ready_at')->nullable();
            $table->timestampsTz();
            $table->unique(['host_id', 'driver_image_recipe_id']);
        });

        Schema::create('host_driver_image_waits', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('host_driver_image_id')->constrained('host_driver_images')->cascadeOnDelete();
            // One wait per start: a second wait cannot claim the same start.
            $table->foreignUlid('session_process_id')->unique()->constrained('session_processes')->cascadeOnDelete();
            $table->timestampTz('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('host_driver_image_waits');
        Schema::dropIfExists('host_driver_images');
    }
};
