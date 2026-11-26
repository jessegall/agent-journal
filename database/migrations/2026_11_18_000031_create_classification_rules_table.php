<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classification_rules', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained('projects')->restrictOnDelete();
            $table->string('scope_type', 16);
            $table->string('scope_owner');
            $table->string('scope_version');
            $table->string('rule_id');
            $table->foreignUlid('active_revision_id')->constrained('rule_revisions')->restrictOnDelete();
            $table->unsignedInteger('active_revision');
            $table->string('status', 16);
            $table->text('state_reason');
            $table->timestampsTz();

            $table->unique(['project_id', 'scope_type', 'scope_owner', 'rule_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classification_rules');
    }
};
