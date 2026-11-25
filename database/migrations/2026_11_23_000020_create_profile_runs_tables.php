<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_runs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('work', 200);
            $table->string('profile_key', 128);
            $table->unsignedInteger('profile_revision');
            $table->string('definition_digest', 64);
            $table->string('trigger_reference', 200);
            $table->string('status', 16);
            $table->unsignedInteger('cursor')->default(0);
            $table->string('awaited_step', 200)->nullable();
            $table->unsignedInteger('generation')->nullable();
            $table->unsignedInteger('unchanged_returns')->default(0);
            $table->text('message')->nullable();
            $table->unsignedInteger('sequence')->default(0);
            $table->timestampsTz();
            $table->unique(['actor_type', 'actor_id', 'trigger_reference']);
            $table->unique(['actor_type', 'actor_id', 'work', 'sequence']);
        });

        Schema::create('profile_step_results', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('profile_run_id')->constrained();
            $table->string('step_reference', 200);
            $table->string('status', 16);
            $table->string('port', 64)->nullable();
            $table->text('evidence')->nullable();
            $table->timestampsTz();
            $table->unique(['profile_run_id', 'step_reference']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_step_results');
        Schema::dropIfExists('profile_runs');
    }
};
