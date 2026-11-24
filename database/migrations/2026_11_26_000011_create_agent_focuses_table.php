<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * What each agent focuses on: one record at a time, named by its type and id.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agent_focuses', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('agent_id', 64)->unique();
            $table->string('focused_type');
            $table->string('focused_id', 26);
            $table->timestampTz('focused_at');
            $table->timestampsTz();

            $table->index(['focused_type', 'focused_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agent_focuses');
    }
};
