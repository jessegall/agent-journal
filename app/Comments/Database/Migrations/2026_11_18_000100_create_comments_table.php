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
        Schema::create('comments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('target_type');
            $table->string('target_id');
            $table->string('author_type');
            $table->string('author_id');
            $table->string('author_session_id')->nullable();
            $table->text('body');
            $table->string('version_id')->nullable();
            $table->string('version_label')->nullable();
            $table->string('anchor_type')->nullable();
            $table->unsignedInteger('section_number')->nullable();
            $table->unsignedInteger('first_line')->nullable();
            $table->unsignedInteger('last_line')->nullable();
            $table->text('quote')->nullable();
            $table->unsignedInteger('start_offset')->nullable();
            $table->unsignedInteger('end_offset')->nullable();
            $table->string('submission_key');
            $table->string('submission_hash');
            $table->timestampTz('created_at');

            $table->index(['target_type', 'target_id', 'id']);
        });

        // One submission key per author and session; a user has no session, so NULLS NOT DISTINCT keeps the key unique for it too.
        DB::statement('CREATE UNIQUE INDEX comments_submission_unique ON comments (author_type, author_id, author_session_id, submission_key) NULLS NOT DISTINCT');
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
