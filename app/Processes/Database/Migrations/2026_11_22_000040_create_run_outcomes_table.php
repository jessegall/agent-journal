<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('run_outcomes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('run_id')->constrained('process_runs')->cascadeOnDelete();
            $table->ulid('attempt_id')->unique();
            $table->string('result', 16);
            $table->string('source', 16);
            $table->unsignedInteger('version')->default(1);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('run_outcomes');
    }
};
