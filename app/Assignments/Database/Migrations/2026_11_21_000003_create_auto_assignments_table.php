<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auto_assignments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->ulid('actor_id');
            $table->string('assignable_type', 64);
            $table->boolean('enabled');
            $table->json('pool');
            $table->unsignedSmallInteger('size');
            $table->unsignedInteger('configuration_revision');
            $table->timestampTz('last_served_at', 6)->nullable();
            $table->timestampsTz();

            $table->unique(['actor_type', 'actor_id', 'assignable_type']);
            $table->index(['enabled', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auto_assignments');
    }
};
