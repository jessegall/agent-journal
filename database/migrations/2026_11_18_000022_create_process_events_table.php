<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('process_events', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('process_run_id')->constrained('process_runs')->cascadeOnDelete();
            $table->unsignedInteger('sequence');
            $table->string('type', 64);
            $table->jsonb('payload');
            $table->timestampsTz();

            $table->unique(['process_run_id', 'sequence']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('process_events');
    }
};
