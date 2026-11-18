<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('engine_frame_times', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('frame_id')->unique();
            $table->foreignUlid('stack_id')->constrained('agent_stacks')->cascadeOnDelete();
            $table->timestampTz('settled_at', 6);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('engine_frame_times');
    }
};
