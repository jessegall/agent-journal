<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_revisions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('skill_id')->constrained('skills')->cascadeOnDelete();
            $table->unsignedInteger('revision');
            $table->string('name');
            $table->text('description');
            $table->json('sections');
            $table->json('condition');
            $table->unsignedInteger('condition_version');
            $table->string('author_type', 16);
            $table->string('author_id');
            $table->string('source_key', 64)->nullable();
            $table->string('source_digest', 64)->nullable();
            $table->string('input_digest', 64);
            $table->timestampTz('created_at');

            $table->unique(['skill_id', 'revision']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_revisions');
    }
};
