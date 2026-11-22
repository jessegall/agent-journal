<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('runtime_events', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('agent_runtime_id');
            $table->unsignedInteger('generation');
            $table->unsignedBigInteger('sequence');
            $table->string('event_type', 32);
            $table->ulid('driver_request_id')->nullable();
            $table->timestampsTz();

            $table->unique(['agent_runtime_id', 'generation', 'sequence']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('runtime_events');
    }
};
