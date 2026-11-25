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
            $table->text('brief');
            $table->string('creator_type', 16);
            $table->string('creator_id', 64);
            $table->unsignedInteger('revision')->default(1);
            $table->string('type', 16);
            $table->string('status', 16)->default('planned');
            $table->text('finish_note')->nullable();
            $table->text('cancel_reason')->nullable();
            $table->unsignedInteger('total_tasks')->default(0);
            $table->unsignedInteger('finished_tasks')->default(0);
            $table->unsignedInteger('cancelled_tasks')->default(0);
            $table->unsignedInteger('blocked_tasks')->default(0);
            $table->unsignedInteger('started_tasks')->default(0);
            $table->timestampsTz();

            $table->index('status');
            $table->unique([
                'number_group_id',
                'number',
            ]);
        });

        Schema::create('phases', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('plan_id')->constrained('plans')->cascadeOnDelete();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('title');
            $table->unsignedInteger('revision')->default(1);
            $table->unsignedInteger('total_tasks')->default(0);
            $table->unsignedInteger('finished_tasks')->default(0);
            $table->unsignedInteger('cancelled_tasks')->default(0);
            $table->unsignedInteger('blocked_tasks')->default(0);
            $table->unsignedInteger('started_tasks')->default(0);
            $table->timestampsTz();

            $table->unique([
                'number_group_id',
                'number',
            ]);
            $table->index([
                'plan_id',
                'number',
                'id',
            ]);
        });

        DB::statement('ALTER TABLE plans ADD CONSTRAINT plans_number_positive CHECK (number > 0)');
        DB::statement('ALTER TABLE phases ADD CONSTRAINT phases_number_positive CHECK (number > 0)');

        Schema::create('phase_tasks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('phase_id')->constrained('phases')->cascadeOnDelete();
            $table->ulid('task_id')->unique();
            $table->unsignedInteger('position');

            $table->unique([
                'phase_id',
                'position',
            ]);
            $table->index([
                'phase_id',
                'position',
                'task_id',
            ]);
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('phase_tasks');
        Schema::dropIfExists('phases');
        Schema::dropIfExists('plans');
    }
};
