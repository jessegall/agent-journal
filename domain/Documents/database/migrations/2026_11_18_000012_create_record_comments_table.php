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
        Schema::create('record_comments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('parent_type', 32);
            $table->ulid('parent_id');
            $table->string('author_type', 16);
            $table->ulid('author_id');
            $table->text('body');
            $table->unsignedBigInteger('revision_number')->nullable();
            $table->text('quote')->nullable();
            $table->unsignedInteger('first_line')->nullable();
            $table->unsignedInteger('last_line')->nullable();
            $table->unsignedInteger('start_offset')->nullable();
            $table->unsignedInteger('end_offset')->nullable();
            $table->timestampsTz();

            $table->index(['parent_type', 'parent_id', 'created_at', 'id'], 'record_comments_parent_order');
        });

        DB::statement("ALTER TABLE record_comments ADD CONSTRAINT record_comments_parent_type CHECK (parent_type IN ('documents.document', 'documents.report'))");
        DB::statement("ALTER TABLE record_comments ADD CONSTRAINT record_comments_user_author CHECK (author_type = 'user')");
        DB::statement('ALTER TABLE record_comments ADD CONSTRAINT record_comments_whole_anchor CHECK ((revision_number IS NULL) = (quote IS NULL) AND (quote IS NULL) = (first_line IS NULL) AND (first_line IS NULL) = (last_line IS NULL) AND (last_line IS NULL) = (start_offset IS NULL) AND (start_offset IS NULL) = (end_offset IS NULL))');
    }

    public function down(): void
    {
        Schema::dropIfExists('record_comments');
    }
};
