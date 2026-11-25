<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_wait_history', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('task_wait_id');
            $table->ulid('dependent_task_id');
            $table->ulid('prerequisite_task_id');
            $table->string('change', 16);
            $table->string('actor_type', 16);
            $table->string('actor_id', 64);
            $table->text('reason')->nullable();
            // One apply of several wait changes writes its rows under one batch, so it reads back as one change.
            $table->ulid('batch_id')->nullable()->index();
            $table->timestampTz('created_at');

            $table->index([
                'dependent_task_id',
                'created_at',
            ]);
            $table->index([
                'prerequisite_task_id',
                'created_at',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_wait_history');
    }
};
