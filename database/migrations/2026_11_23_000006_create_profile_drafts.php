<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_drafts', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('profile_key')->unique();
            $table->unsignedInteger('revision')->default(0);
            $table->ulid('current_revision_id')->nullable();
            $table->timestampsTz();
        });

        Schema::create('profile_draft_revisions', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('profile_key');
            $table->foreign('profile_key')->references('profile_key')->on('profile_drafts')->cascadeOnDelete();
            $table->unsignedInteger('revision');
            $table->json('script_source');
            $table->string('author_type', 16);
            $table->string('author_id');
            $table->timestampTz('created_at');
            $table->unique(['profile_key', 'revision']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_draft_revisions');
        Schema::dropIfExists('profile_drafts');
    }
};
