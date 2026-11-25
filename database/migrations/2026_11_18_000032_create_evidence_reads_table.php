<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evidence_reads', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->index()->constrained('projects')->restrictOnDelete();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->foreignUlid('process_run_id')->constrained('process_runs')->cascadeOnDelete();
            $table->foreignUlid('part_run_id')->constrained('part_runs')->cascadeOnDelete();
            $table->string('source', 16);
            $table->unsignedBigInteger('first_byte');
            $table->unsignedBigInteger('end_byte');
            $table->timestampTz('read_at');

            $table->index(['process_run_id', 'actor_type', 'actor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evidence_reads');
    }
};
