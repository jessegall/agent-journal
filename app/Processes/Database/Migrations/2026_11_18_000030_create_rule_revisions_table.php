<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rule_revisions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('project_key', 64);
            $table->string('scope_type', 16);
            $table->string('scope_owner');
            $table->string('scope_version');
            $table->string('rule_id');
            $table->unsignedInteger('revision');
            $table->foreignUlid('rule_proposal_revision_id')
                ->constrained('rule_proposal_revisions')
                ->restrictOnDelete();
            $table->jsonb('payload');
            $table->jsonb('script_bindings');
            $table->jsonb('reader_approvals');
            $table->string('digest', 64);
            $table->string('author_type', 16);
            $table->string('author_id');
            $table->string('approver_type', 16);
            $table->string('approver_id');
            $table->timestampTz('approved_at');

            $table->unique(['project_key', 'scope_type', 'scope_owner', 'rule_id', 'revision']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rule_revisions');
    }
};
