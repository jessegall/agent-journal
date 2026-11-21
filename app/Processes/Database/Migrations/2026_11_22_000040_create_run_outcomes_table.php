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
        Schema::table('process_runs', function (Blueprint $table) {
            $table->string('request_intent', 32)->default('explicit_request');
            $table->string('responsible_type', 16)->nullable();
            $table->string('responsible_id', 64)->nullable();
            $table->string('outcome_user_id', 64)->nullable();
            $table->ulid('attempt_id')->nullable()->unique();
        });

        DB::statement('UPDATE process_runs SET attempt_id = id WHERE attempt_id IS NULL');

        Schema::create('run_outcomes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('run_id')->constrained('process_runs')->cascadeOnDelete();
            $table->ulid('attempt_id')->unique();
            $table->string('result', 16);
            $table->string('source', 16);
            $table->unsignedInteger('version')->default(1);
            $table->timestampsTz();
        });

        Schema::create('run_result_conflicts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('run_id')->constrained('process_runs')->cascadeOnDelete();
            $table->ulid('attempt_id')->index();
            $table->string('kept_result', 16);
            $table->string('offered_result', 16);
            $table->timestampTz('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('run_result_conflicts');
        Schema::dropIfExists('run_outcomes');

        Schema::table('process_runs', function (Blueprint $table) {
            $table->dropColumn(['request_intent', 'responsible_type', 'responsible_id', 'outcome_user_id', 'attempt_id']);
        });
    }
};
