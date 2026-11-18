<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('title');
            $table->string('type', 16);
            $table->string('state', 16)->default('planned');
            $table->boolean('focused')->default(false);
            $table->timestampsTz();

            $table->index('state');
            $table->unique(['number_group_id', 'number']);
        });

        Schema::create('phases', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('plan_id')->constrained('plans')->cascadeOnDelete();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('title');
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);
        });

        DB::statement('ALTER TABLE plans ADD CONSTRAINT plans_number_positive CHECK (number > 0)');
        DB::statement('ALTER TABLE phases ADD CONSTRAINT phases_number_positive CHECK (number > 0)');

        Schema::create('phase_tasks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('phase_id')->constrained('phases')->cascadeOnDelete();
            $table->ulid('task_id')->unique();
            $table->unsignedInteger('position');

            $table->unique(['phase_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phase_tasks');
        Schema::dropIfExists('phases');
        Schema::dropIfExists('plans');
    }
};
