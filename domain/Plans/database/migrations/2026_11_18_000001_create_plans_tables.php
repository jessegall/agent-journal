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
            $table->string('state', 16)->default('planned');
            $table->text('finish_note')->nullable();
            $table->text('cancel_reason')->nullable();
            $table->unsignedInteger('total_tasks')->default(0);
            $table->unsignedInteger('finished_tasks')->default(0);
            $table->unsignedInteger('cancelled_tasks')->default(0);
            $table->unsignedInteger('blocked_tasks')->default(0);
            $table->unsignedInteger('started_tasks')->default(0);
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
            $table->unsignedInteger('revision')->default(1);
            $table->unsignedInteger('total_tasks')->default(0);
            $table->unsignedInteger('finished_tasks')->default(0);
            $table->unsignedInteger('cancelled_tasks')->default(0);
            $table->unsignedInteger('blocked_tasks')->default(0);
            $table->unsignedInteger('started_tasks')->default(0);
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);
            $table->index(['plan_id', 'number', 'id']);
        });

        DB::statement('ALTER TABLE plans ADD CONSTRAINT plans_number_positive CHECK (number > 0)');
        DB::statement('ALTER TABLE phases ADD CONSTRAINT phases_number_positive CHECK (number > 0)');

        Schema::create('phase_tasks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('phase_id')->constrained('phases')->cascadeOnDelete();
            $table->ulid('task_id')->unique();
            $table->unsignedInteger('position');

            $table->unique(['phase_id', 'position']);
            $table->index(['phase_id', 'position', 'task_id']);
        });

        Schema::create('plan_review_editions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('plan_id')->constrained('plans')->cascadeOnDelete();
            $table->unsignedInteger('number');
            $table->string('requested_by_type', 16);
            $table->string('requested_by_id', 64);
            $table->unsignedInteger('plan_revision');
            $table->string('title');
            $table->text('brief');
            $table->string('type', 16);
            $table->string('fingerprint', 64);
            $table->string('state', 24);
            $table->string('decided_by_type', 16)->nullable();
            $table->string('decided_by_id', 64)->nullable();
            $table->timestampTz('decided_at')->nullable();
            $table->text('decision_reason')->nullable();
            $table->string('decision_request_key', 200)->nullable();
            $table->boolean('is_historical')->default(false);
            $table->timestampsTz();

            $table->unique(['plan_id', 'number']);
        });

        Schema::create('plan_review_phases', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('edition_id')->constrained('plan_review_editions')->cascadeOnDelete();
            $table->unsignedInteger('position');
            $table->ulid('phase_id');
            $table->unsignedBigInteger('phase_number');
            $table->unsignedInteger('phase_revision');
            $table->string('title');

            $table->index(['edition_id', 'position', 'id']);
        });

        Schema::create('plan_review_members', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('edition_id')->constrained('plan_review_editions')->cascadeOnDelete();
            $table->unsignedInteger('phase_position');
            $table->unsignedInteger('position');
            $table->ulid('task_id');
            $table->unsignedBigInteger('task_number');
            $table->unsignedInteger('task_revision');
            $table->string('title');
            $table->text('brief');

            $table->index(['edition_id', 'phase_position', 'position', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_review_members');
        Schema::dropIfExists('plan_review_phases');
        Schema::dropIfExists('plan_review_editions');
        Schema::dropIfExists('phase_tasks');
        Schema::dropIfExists('phases');
        Schema::dropIfExists('plans');
    }
};
