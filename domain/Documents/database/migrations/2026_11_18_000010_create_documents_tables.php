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
        Schema::create('documents', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('creator_type', 16);
            $table->ulid('creator_id');
            $table->ulid('origin_agent_id')->nullable();
            $table->ulid('origin_session_id')->nullable();
            $table->string('attention', 16)->default('active');
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);
        });

        Schema::create('document_revisions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('document_id')->constrained('documents')->restrictOnDelete();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('title');
            $table->string('abstract');
            $table->longText('body');
            $table->string('author_type', 16);
            $table->ulid('author_id');
            $table->ulid('session_id')->nullable();
            $table->timestampTz('closed_at')->nullable();
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);
            $table->unique(['document_id', 'number']);
        });

        Schema::create('reports', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('title');
            $table->string('abstract');
            $table->longText('body');
            $table->string('creator_type', 16);
            $table->ulid('creator_id');
            $table->ulid('origin_agent_id')->nullable();
            $table->ulid('origin_session_id')->nullable();
            $table->timestampTz('filed_at');
            $table->string('attention', 16)->default('active');
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);
        });

        DB::statement('ALTER TABLE documents ADD CONSTRAINT documents_number_positive CHECK (number > 0)');
        DB::statement('ALTER TABLE document_revisions ADD CONSTRAINT document_revisions_number_positive CHECK (number > 0)');
        DB::statement('ALTER TABLE reports ADD CONSTRAINT reports_number_positive CHECK (number > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
        Schema::dropIfExists('document_revisions');
        Schema::dropIfExists('documents');
    }
};
