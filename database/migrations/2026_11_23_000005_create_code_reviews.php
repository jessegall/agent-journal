<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('code_reviews', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('certificate', 64)->unique();
            $table->string('work_type', 64);
            $table->string('work_id');
            $table->string('worker_type', 16);
            $table->string('worker_id');
            $table->string('state', 16);
            $table->string('import_ref', 200)->nullable();
            $table->string('base', 64)->nullable();
            $table->string('head', 64)->nullable();
            $table->unsignedSmallInteger('import_attempts')->default(0);
            $table->text('import_failure')->nullable();
            $table->string('origin_target', 200)->nullable();
            $table->ulid('ask_id')->nullable()->unique();
            $table->timestampsTz();
        });

        Schema::create('review_decisions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('code_review_id')->unique()->constrained('code_reviews');
            $table->string('decision', 16);
            $table->string('reviewer_type', 16);
            $table->string('reviewer_id');
            $table->string('base', 64);
            $table->string('head', 64);
            $table->text('findings');
            $table->ulid('merge_ask_id')->nullable();
            $table->timestampTz('repaired_at')->nullable();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review_decisions');
        Schema::dropIfExists('code_reviews');
    }
};
