<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ask_requesters', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->timestampsTz();
            $table->unique(['actor_type', 'actor_id']);
        });

        Schema::create('asks', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('type_key');
            $table->string('origin', 16);
            $table->string('submission_key', 128);
            $table->char('submission_hash', 64);
            $table->text('body');
            $table->string('subject_type');
            $table->string('work');
            $table->string('head')->nullable();
            $table->string('pending_target')->nullable();
            $table->unsignedInteger('version');
            $table->boolean('open')->default(true);
            $table->string('outcome', 32)->nullable();
            $table->text('late_answer')->nullable();
            $table->timestampsTz();
            $table->unique(['actor_type', 'actor_id', 'submission_key']);
            $table->index(['actor_type', 'actor_id', 'origin', 'open']);
        });

        Schema::create('ask_hops', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('ask_id')->constrained();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('type_key');
            $table->unsignedInteger('version');
            $table->unsignedInteger('route_version');
            $table->timestampTz('accepted_at');
            $table->text('result')->nullable();
            $table->string('wake')->nullable();
            $table->string('attention')->nullable();
            $table->timestampsTz();
            $table->unique(['ask_id', 'version']);
            $table->index(['actor_type', 'actor_id', 'ask_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ask_hops');
        Schema::dropIfExists('asks');
        Schema::dropIfExists('ask_requesters');
    }
};
