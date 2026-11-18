<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('kind', 16);
            $table->string('state', 16)->default('planned');
            $table->boolean('focused')->default(false);
            $table->unsignedBigInteger('agent_id')->nullable();
            $table->timestampsTz();

            $table->index('state');
        });

        Schema::create('phases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained('plans')->cascadeOnDelete();
            $table->string('title');
            $table->unsignedInteger('position');
            $table->timestampsTz();

            $table->unique(['plan_id', 'position']);
        });

        Schema::create('phase_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phase_id')->constrained('phases')->cascadeOnDelete();
            $table->unsignedBigInteger('task_id')->unique();
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
