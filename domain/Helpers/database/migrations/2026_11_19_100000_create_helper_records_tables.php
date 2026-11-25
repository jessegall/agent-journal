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
        Schema::create('helper_identities', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained('projects')->restrictOnDelete();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('profile_key', 64);
            $table->string('profile_base', 64);
            $table->string('helper_actor_type', 16);
            $table->string('helper_actor_id');
            $table->string('designated_profile', 64)->nullable();
            $table->timestampsTz();

            $table->unique([
                'project_id',
                'designated_profile',
            ]);

            $table->index([
                'project_id',
                'actor_type',
                'actor_id',
            ]);

            $table->unique([
                'helper_actor_type',
                'helper_actor_id',
            ]);
        });

        Schema::create('helper_purposes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained('projects')->restrictOnDelete();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('profile_key', 64);
            $table->string('purpose_type', 16);
            $table->string('subject_type', 64)->nullable();
            $table->string('subject_id')->nullable();
            $table->string('label', 200);
            $table->timestampsTz();

            $table->unique([
                'project_id',
                'actor_type',
                'actor_id',
                'profile_key',
                'subject_type',
                'subject_id',
            ]);
        });

        DB::statement("ALTER TABLE helper_purposes ADD CONSTRAINT helper_purposes_subject_matches_type CHECK (
            (purpose_type = 'subject' AND subject_type IS NOT NULL AND subject_id IS NOT NULL)
            OR (purpose_type = 'free' AND subject_type IS NULL AND subject_id IS NULL))");

        Schema::create('helper_jobs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained('projects')->restrictOnDelete();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->foreignUlid('helper_identity_id')->constrained('helper_identities')->restrictOnDelete();
            $table->foreignUlid('helper_purpose_id')->constrained('helper_purposes')->restrictOnDelete();
            $table->text('brief');
            $table->json('source_subjects');
            $table->string('request_id', 64);
            $table->string('status', 16);
            $table->json('steering');
            $table->string('stop_evidence_reference')->nullable();
            $table->unsignedInteger('profile_revision');
            $table->timestampTz('finished_at')->nullable();
            $table->string('payload_digest', 64);
            $table->boolean('identity_new');
            $table->boolean('independent');
            $table->string('conversation_mode', 16);
            $table->string('conversation_reason', 500);
            $table->timestampsTz();

            $table->index([
                'actor_type',
                'actor_id',
            ]);

            $table->unique([
                'project_id',
                'actor_type',
                'actor_id',
                'request_id',
            ]);
        });

        Schema::create('helper_notices', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->foreignUlid('helper_identity_id')->constrained('helper_identities')->restrictOnDelete();
            $table->foreignUlid('helper_job_id')->constrained('helper_jobs')->cascadeOnDelete();
            $table->string('job_state', 16);
            $table->text('text');
            $table->timestampTz('delivered_at')->nullable();
            $table->timestampsTz();

            $table->index([
                'actor_type',
                'actor_id',
            ]);
        });

        Schema::create('helper_messages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->foreignUlid('helper_identity_id')->constrained('helper_identities')->restrictOnDelete();
            $table->text('text');
            $table->text('suggested_command');
            $table->timestampsTz();

            $table->index([
                'actor_type',
                'actor_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('helper_messages');
        Schema::dropIfExists('helper_notices');
        Schema::dropIfExists('helper_jobs');
        Schema::dropIfExists('helper_purposes');
        Schema::dropIfExists('helper_identities');
    }
};
