<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reader_proofs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained('projects')->restrictOnDelete();
            $table->foreignUlid('command_request_id')->constrained('command_requests')->cascadeOnDelete();
            $table->foreignUlid('reader_revision_id')->constrained('reader_revisions')->cascadeOnDelete();
            $table->foreignUlid('rule_proposal_revision_id')->constrained('rule_proposal_revisions')->cascadeOnDelete();
            $table->jsonb('proven_branches');
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->timestampTz('created_at');

            $table->index(['project_id', 'command_request_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reader_proofs');
    }
};
