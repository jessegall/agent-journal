<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('output_assessments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('project_key', 64);
            $table->foreignUlid('part_run_id')->constrained('part_runs')->cascadeOnDelete();
            $table->foreignUlid('reader_revision_id')->constrained('reader_revisions')->cascadeOnDelete();
            $table->foreignUlid('rule_revision_id')->constrained('rule_revisions')->cascadeOnDelete();
            $table->string('interpretation', 16);
            $table->string('outcome', 16);
            $table->jsonb('problems');
            $table->jsonb('counts');
            $table->jsonb('final_offsets');
            $table->ulid('replaces_assessment_id')->nullable();
            $table->foreign('replaces_assessment_id')->references('id')->on('output_assessments')->nullOnDelete();
            $table->timestampTz('created_at');

            $table->index(['project_key', 'part_run_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('output_assessments');
    }
};
