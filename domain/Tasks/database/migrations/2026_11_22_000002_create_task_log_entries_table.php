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
        Schema::create('task_log_entries', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->foreignUlid('task_run_id')->constrained('task_runs')->restrictOnDelete();
            $table->unsignedInteger('run_number');
            $table->string('actor_type', 16);
            $table->string('actor_id', 64);
            $table->text('text');
            $table->unsignedInteger('sequence');
            $table->timestampTz('created_at');

            $table->unique([
                'task_id',
                'sequence',
            ]);

            $table->index([
                'task_id',
                'sequence',
                'id',
            ]);

            // Search walks log lines by parent task and line id, the order their hits are ranked in.
            $table->index([
                'task_id',
                'id',
            ]);
        });

        // Search narrows log lines by their text through a trigram index, so a rare word reads no other line.
        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');
        DB::statement('CREATE INDEX task_log_entries_text_search ON task_log_entries USING gin (text gin_trgm_ops)');
    }

    public function down(): void
    {
        Schema::dropIfExists('task_log_entries');
    }
};
