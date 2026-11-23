<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_entries', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type');
            $table->string('actor_id');
            $table->string('environment_id')->nullable()->index();
            $table->unsignedTinyInteger('level');
            $table->string('type', 32);
            $table->string('subject', 300);
            $table->json('found')->nullable();
            $table->timestampTz('occurred_at');
            $table->timestampsTz();

            $table->index(['occurred_at', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_entries');
    }
};
