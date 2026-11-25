<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('part_runs', function (Blueprint $table) {
            $table->ulid('id');
            $table->primary('id');
            $table->foreignUlid('process_run_id')->constrained('process_runs')->cascadeOnDelete();
            $table->unsignedInteger('syntax_node');
            $table->string('part_id', 64);
            $table->unsignedInteger('attempt');
            $table->ulid('parent_part_run_id')->nullable();
            $table->foreign('parent_part_run_id')->references('id')->on('part_runs')->nullOnDelete();
            $table->string('operation');
            $table->string('lifecycle', 16);
            $table->timestampTz('started_at')->nullable();
            $table->timestampTz('ended_at')->nullable();
            $table->unsignedInteger('pid')->nullable();
            $table->string('host')->nullable();
            $table->string('end_type', 16);
            $table->integer('end_code')->default(0);
            $table->string('end_reason')->default('');
            $table->boolean('streams_drained')->default(false);
            $table->string('skip_reason')->default('');
            $table->string('stop_reason')->default('');
            $table->string('capture_state', 16);
            $table->jsonb('stream_offsets');
            $table->timestampsTz();

            $table->unique(['process_run_id', 'syntax_node', 'part_id', 'attempt']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('part_runs');
    }
};
