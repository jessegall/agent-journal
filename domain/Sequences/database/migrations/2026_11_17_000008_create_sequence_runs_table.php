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
        Schema::create('sequence_runs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('name');
            $table->jsonb('steps');
            $table->unsignedInteger('current_step')->default(1);
            $table->string('state', 16)->default('running');
            $table->ulid('agent_id')->nullable();
            $table->ulid('session_id')->nullable();
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);

            $table->index(['agent_id', 'session_id']);
        });

        DB::statement('ALTER TABLE sequence_runs ADD CONSTRAINT sequence_runs_number_positive CHECK (number > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('sequence_runs');
    }
};
