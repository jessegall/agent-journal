<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reader_revisions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('project_key', 64);
            $table->foreignUlid('command_request_id')->constrained('command_requests')->cascadeOnDelete();
            $table->unsignedInteger('declaration_revision');
            $table->string('operation');
            $table->string('contract_label');
            $table->jsonb('definition');
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->timestampTz('created_at');

            $table->index(['project_key', 'operation']);
        });

        Schema::create('reader_positions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('part_run_id')->constrained('part_runs')->cascadeOnDelete();
            $table->foreignUlid('reader_revision_id')->constrained('reader_revisions')->cascadeOnDelete();
            $table->jsonb('checkpoint');
            $table->timestampsTz();

            $table->unique(['part_run_id', 'reader_revision_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reader_positions');
        Schema::dropIfExists('reader_revisions');
    }
};
