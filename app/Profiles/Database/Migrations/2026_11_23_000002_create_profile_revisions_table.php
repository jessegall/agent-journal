<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_revisions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('profile_id')->constrained('profiles')->cascadeOnDelete();
            $table->unsignedInteger('revision');
            $table->string('type', 32);
            $table->text('instructions');
            $table->string('model');
            $table->json('skill_allowlist')->nullable();
            $table->json('required_skills');
            $table->string('program', 32)->nullable();
            $table->boolean('program_pinned');
            $table->json('allowed_models');
            $table->json('access_policy');
            $table->json('stop_conditions');
            $table->json('execution_policy');
            $table->string('configuration_hash', 64);
            $table->json('provenance');
            $table->string('authorization_type', 32);
            $table->json('ability_grants');
            $table->string('author_type', 16);
            $table->string('author_id');
            $table->timestampTz('created_at');

            $table->unique(['profile_id', 'revision']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_revisions');
    }
};
