<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_runs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->unsignedInteger('run_number');
            $table->string('started_by_type', 16);
            $table->string('started_by_id', 64);
            $table->string('status', 16);
            $table->text('outcome')->nullable();
            $table->timestampsTz();

            $table->unique([
                'task_id',
                'run_number',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_runs');
    }
};
