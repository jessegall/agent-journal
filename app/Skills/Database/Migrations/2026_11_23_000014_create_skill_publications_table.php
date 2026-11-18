<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_publications', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('session_id');
            $table->string('program', 64);
            $table->string('target', 1024);
            $table->foreignUlid('generation_id')->constrained('skill_generations')->restrictOnDelete();
            $table->string('selection_digest', 64);
            $table->ulid('expected_previous_generation_id')->nullable();
            $table->unsignedBigInteger('fencing_version')->default(0);
            $table->string('lease_holder', 128)->nullable();
            $table->timestampTz('lease_until')->nullable();
            $table->unsignedInteger('progress')->default(0);
            $table->string('state', 16);
            $table->string('open_key', 1100)->nullable()->unique();
            $table->json('manifest')->nullable();
            $table->text('error')->nullable();
            $table->timestampsTz();

            $table->index(['state', 'created_at']);
            $table->index(['session_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_publications');
    }
};
