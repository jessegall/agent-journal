<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rule_proposals', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained('projects')->restrictOnDelete();
            $table->string('scope_type', 16);
            $table->string('scope_owner');
            $table->string('scope_version');
            $table->foreignUlid('command_request_id')->nullable()->constrained('command_requests')->nullOnDelete();
            $table->string('program');
            $table->string('operation');
            $table->string('status', 16);
            $table->string('author_type', 16);
            $table->string('author_id');
            $table->string('request_id');
            $table->string('payload_digest', 64);
            $table->jsonb('replaces');
            $table->unsignedInteger('current_revision');
            $table->timestampsTz();

            $table->unique(['project_id', 'author_type', 'author_id', 'request_id']);
            $table->index(['project_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rule_proposals');
    }
};
