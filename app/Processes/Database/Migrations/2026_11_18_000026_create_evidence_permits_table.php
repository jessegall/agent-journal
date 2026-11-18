<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evidence_permits', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('project_key', 64);
            $table->string('working_folder');
            $table->text('source_line');
            $table->string('source_digest', 64);
            $table->string('classification_digest', 64);
            $table->jsonb('approved_classes');
            $table->string('runner_type', 16);
            $table->string('runner_id');
            $table->unsignedBigInteger('byte_cap');
            $table->unsignedInteger('seconds_cap');
            $table->timestampTz('expires_at');
            $table->string('request_id', 64)->nullable()->unique();
            $table->timestampTz('consumed_at')->nullable();
            $table->foreignUlid('process_run_id')->nullable()->constrained('process_runs')->nullOnDelete();
            $table->foreignUlid('command_request_id')->nullable()->constrained('command_requests')->cascadeOnDelete();
            $table->jsonb('candidate_rules');
            $table->timestampsTz();

            $table->index(['project_key', 'runner_type', 'runner_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evidence_permits');
    }
};
