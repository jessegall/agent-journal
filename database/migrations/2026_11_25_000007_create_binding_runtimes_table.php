<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A binding's start by the id its device chose before starting anything, and the runtime it opened, so a
        // start asked again after a lost reply answers the same runtime.
        Schema::create('binding_runtimes', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('binding_id')->constrained('project_bindings');
            $table->string('start_id');
            $table->string('session_id');
            $table->string('runtime_id');
            $table->timestampTz('created_at')->nullable();
            $table->unique(['binding_id', 'start_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('binding_runtimes');
    }
};
