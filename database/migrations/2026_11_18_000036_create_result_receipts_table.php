<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('result_receipts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('project_key', 64);
            $table->foreignUlid('process_run_id')->constrained('process_runs')->cascadeOnDelete();
            $table->foreignUlid('part_run_id')->constrained('part_runs')->cascadeOnDelete();
            $table->unsignedInteger('attempt');
            $table->string('work_fingerprint', 64);
            $table->foreignUlid('rule_revision_id')->constrained('rule_revisions')->cascadeOnDelete();
            $table->foreignUlid('reader_revision_id')->constrained('reader_revisions')->cascadeOnDelete();
            $table->string('exit_policy_digest', 64);
            $table->string('manifest_digest', 64);
            $table->foreignUlid('output_assessment_id')->unique()->constrained('output_assessments')->cascadeOnDelete();
            $table->string('outcome', 16);
            $table->ulid('superseded_by_id')->nullable();
            $table->foreign('superseded_by_id')->references('id')->on('result_receipts')->nullOnDelete();
            $table->timestampTz('published_at');

            $table->index(['project_key', 'part_run_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('result_receipts');
    }
};
