<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('driver_turns', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('agent_runtime_id');
            $table->unsignedInteger('process_generation');
            $table->string('native_prompt_id');
            $table->string('observed_model')->nullable();
            $table->string('observed_effort', 32)->nullable();
            $table->string('outcome', 32)->nullable();
            $table->timestampTz('started_at');
            $table->timestampTz('finished_at')->nullable();
            $table->timestampsTz();

            $table->unique(['agent_runtime_id', 'process_generation', 'native_prompt_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('driver_turns');
    }
};
