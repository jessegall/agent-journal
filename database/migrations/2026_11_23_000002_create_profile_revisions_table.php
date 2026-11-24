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
            $table->string('base', 32);
            $table->text('instructions');
            $table->unsignedTinyInteger('preferred_tier');
            $table->json('skill_allowlist')->nullable();
            $table->json('required_skills');
            $table->string('preferred_driver', 32)->nullable();
            $table->json('access_policy');
            $table->json('stop_conditions');
            $table->json('execution_policy');
            $table->string('configuration_hash', 64);
            $table->json('provenance');
            $table->string('authorization_type', 32);
            $table->json('policy_grants');
            $table->json('denied_commands');
            $table->json('read_grants');
            $table->json('supervisor');
            $table->string('instances', 16);
            $table->text('script_source');
            $table->json('script_commands');
            $table->json('compiled_script')->nullable();
            $table->string('script_definition_digest', 64)->nullable();
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
