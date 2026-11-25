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
            $table->string('attention', 16)->default('active');
            $table->ulid('current_revision_id')->nullable()->index();
            $table->timestampsTz();

            $table->unique([
                'number_group_id',
                'number',
            ]);
        });

        Schema::create('document_revisions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('document_id')->constrained('documents')->restrictOnDelete();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('title');
            $table->string('abstract', 1000);
            $table->longText('body');
            $table->string('author_type', 16);
            $table->ulid('author_id');
            $table->timestampTz('closed_at')->nullable();
            $table->timestampsTz();

            $table->unique([
                'number_group_id',
                'number',
            ]);

            $table->unique([
                'document_id',
                'number',
            ]);
        });

        Schema::create('reports', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('title');
            $table->string('abstract', 1000);
            $table->longText('body');
            $table->string('creator_type', 16);
            $table->ulid('creator_id');
            $table->timestampTz('filed_at');
            $table->string('attention', 16)->default('active');
            $table->timestampsTz();

            $table->unique([
                'number_group_id',
                'number',
            ]);
        });

        DB::statement('ALTER TABLE documents ADD CONSTRAINT documents_number_positive CHECK (number > 0)');
        DB::statement('ALTER TABLE document_revisions ADD CONSTRAINT document_revisions_number_positive CHECK (number > 0)');
        DB::statement('ALTER TABLE reports ADD CONSTRAINT reports_number_positive CHECK (number > 0)');

        // The library search matches words anywhere in a title, abstract or body, which only a trigram index can serve.
        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');

        foreach ([
            'document_revisions',
            'reports',
        ] as $searched) {
            foreach ([
                'title',
                'abstract',
                'body',
            ] as $column) {
                DB::statement(
                    sprintf(
                        'CREATE INDEX %s_%s_search ON %s USING gin ((%s::text) gin_trgm_ops)',
                        $searched,
                        $column,
                        $searched,
                        $column,
                    ),
                );
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
        Schema::dropIfExists('document_revisions');
        Schema::dropIfExists('documents');
    }
};
