<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
            $table->text('body');
            $table->string('submission_key');
            $table->string('submission_hash');
            $table->timestampTz('created_at');

            $table->index(['target_type', 'target_id', 'id']);

            $table->unique(['author_type', 'author_id', 'submission_key'], 'comments_submission_unique');
        });

        Schema::create('comment_anchors', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('comment_id')->unique()->constrained('comments')->cascadeOnDelete();
            $table->string('version_id');
            $table->string('version_label');
            $table->string('anchor_type');
            $table->unsignedInteger('section_number')->nullable();
            $table->unsignedInteger('first_line');
            $table->unsignedInteger('last_line');
            $table->text('quote')->nullable();
            $table->unsignedInteger('start_offset')->nullable();
            $table->unsignedInteger('end_offset')->nullable();

            $table->index(['version_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comment_anchors');
        Schema::dropIfExists('comments');
    }
};
