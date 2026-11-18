<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('output_chunks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('part_run_id')->constrained('part_runs')->cascadeOnDelete();
            $table->string('stream', 8);
            $table->unsignedBigInteger('offset');
            $table->unsignedInteger('length');
            $table->string('checksum', 64);
            $table->timestampTz('captured_at');
            $table->string('storage_path');
            $table->timestampsTz();

            $table->unique(['part_run_id', 'stream', 'offset']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('output_chunks');
    }
};
