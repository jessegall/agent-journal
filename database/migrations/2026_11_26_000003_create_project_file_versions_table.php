<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_file_versions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_file_id')->constrained('project_files')->cascadeOnDelete();
            $table->string('digest', 64);
            $table->longText('text');
            $table->unsignedInteger('line_count');
            $table->timestampsTz();

            $table->unique(['project_file_id', 'digest']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_file_versions');
    }
};
