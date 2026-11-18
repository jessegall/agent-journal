<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_drafts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('document_id')->unique()->constrained('documents')->cascadeOnDelete();
            $table->string('token')->unique();
            $table->string('author_type', 16);
            $table->ulid('author_id');
            $table->ulid('session_id')->nullable();
            $table->unsignedBigInteger('base_revision_number');
            $table->unsignedInteger('version')->default(1);
            $table->string('title');
            $table->string('abstract');
            $table->longText('body');
            $table->timestampTz('opened_at');
            $table->timestampsTz();

            $table->unique(['author_type', 'author_id'], 'document_drafts_author_unique');
        });

        DB::statement("ALTER TABLE document_drafts ADD CONSTRAINT document_drafts_agent_session CHECK (author_type <> 'agent' OR session_id IS NOT NULL)");

        Schema::create('document_closes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('token')->unique();
            $table->foreignUlid('document_id')->constrained('documents')->cascadeOnDelete();
            $table->unsignedBigInteger('base_revision_number');
            $table->unsignedBigInteger('result_revision_number');
            $table->string('author_type', 16);
            $table->ulid('author_id');
            $table->ulid('session_id')->nullable();
            $table->string('cause', 16);
            $table->string('closer_type', 16)->nullable();
            $table->ulid('closer_id')->nullable();
            $table->string('reason')->nullable();
            $table->boolean('published');
            $table->timestampTz('closed_at');
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_closes');
        Schema::dropIfExists('document_drafts');
    }
};
