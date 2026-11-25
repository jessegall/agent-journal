<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_checks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->foreignUlid('task_run_id')->constrained('task_runs')->restrictOnDelete();
            $table->unsignedInteger('run_number');
            $table->string('operation', 200);
            $table->string('caller_type', 16);
            $table->string('caller_id', 64);
            $table->ulid('process_run_id')->unique();
            $table->ulid('result_receipt_id')->nullable();
            $table->string('outcome', 32)->nullable();
            $table->timestampTz('created_at');
            $table->timestampTz('bound_at')->nullable();

            $table->index([
                'task_id',
                'id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_checks');
    }
};
