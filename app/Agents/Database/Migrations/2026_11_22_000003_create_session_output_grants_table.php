<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_output_grants', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('session_id');
            $table->ulid('start_id');
            $table->unsignedInteger('mapping_generation');
            $table->ulid('conversation_id');
            $table->string('transcript_path', 1024);
            $table->string('output_directory', 1024)->nullable();
            $table->timestampsTz();

            $table->index(['session_id', 'start_id', 'mapping_generation']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_output_grants');
    }
};
