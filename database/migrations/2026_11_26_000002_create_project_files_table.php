<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_files', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->foreignUlid('binding_id')->constrained('project_bindings')->cascadeOnDelete();
            $table->string('path', 1024);
            $table->timestampsTz();

            $table->unique(['binding_id', 'path']);
            $table->unique(['number_group_id', 'number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_files');
    }
};
