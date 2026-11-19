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
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('profile_key', 64);
            $table->string('profile_base', 64);
            $table->timestampsTz();

            $table->index(['actor_type', 'actor_id']);
        });

        Schema::create('helper_purposes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('profile_key', 64);
            $table->string('purpose_type', 16);
            $table->string('subject_type', 64)->nullable();
            $table->string('subject_id')->nullable();
            $table->string('label', 200);
            $table->timestampsTz();

            $table->unique(['actor_type', 'actor_id', 'profile_key', 'subject_type', 'subject_id']);
        });
        DB::statement("ALTER TABLE helper_purposes ADD CONSTRAINT helper_purposes_subject_matches_type CHECK (
            (purpose_type = 'subject' AND subject_type IS NOT NULL AND subject_id IS NOT NULL)
            OR (purpose_type = 'free' AND subject_type IS NULL AND subject_id IS NULL))");

        Schema::create('helper_jobs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->foreignUlid('helper_identity_id')->constrained('helper_identities')->restrictOnDelete();
            $table->foreignUlid('helper_purpose_id')->constrained('helper_purposes')->restrictOnDelete();
            $table->text('brief');
            $table->json('source_snapshot');
            $table->string('request_id', 64);
            $table->string('state', 16);
            $table->json('steering');
            $table->string('result_reference')->nullable();
            $table->string('stop_evidence_reference')->nullable();
            $table->unsignedInteger('profile_revision');
            $table->timestampsTz();

            $table->index(['actor_type', 'actor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('helper_jobs');
        Schema::dropIfExists('helper_purposes');
        Schema::dropIfExists('helper_identities');
    }
};
