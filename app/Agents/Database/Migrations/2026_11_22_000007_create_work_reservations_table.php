<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_reservations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->unsignedInteger('generation');
            $table->string('certificate', 64)->unique();
            $table->timestampTz('handed_off_at')->nullable();
            $table->timestampTz('released_at')->nullable();
            $table->timestampsTz();
            $table->index(['actor_type', 'actor_id', 'released_at']);
            $table->index(['handed_off_at', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_reservations');
    }
};
