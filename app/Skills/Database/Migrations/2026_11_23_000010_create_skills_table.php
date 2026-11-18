<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('key', 64)->unique();
            $table->string('owner_type', 16);
            $table->string('owner_id');
            $table->string('environment', 64)->nullable();
            $table->ulid('current_revision_id')->nullable();
            $table->timestampTz('retired_at')->nullable();
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
