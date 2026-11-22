<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_waits', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('dependent_task_id')->constrained('tasks')->cascadeOnDelete();
            $table->ulid('prerequisite_task_id');
            $table->string('created_by_type', 16);
            $table->string('created_by_id', 64);
            $table->timestampTz('waived_at')->nullable();
            $table->string('waived_by_type', 16)->nullable();
            $table->string('waived_by_id', 64)->nullable();
            $table->text('waive_reason')->nullable();
            $table->timestampsTz();

            $table->unique(['dependent_task_id', 'prerequisite_task_id']);
            $table->index('prerequisite_task_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_waits');
    }
};
