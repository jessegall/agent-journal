<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // One row per project connected from another machine; the installation's own project stays its config key.
        Schema::create('projects', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('key')->unique();
            $table->string('label');
            $table->timestampsTz();
        });

        // The environments of a connected project; every binding works in one, its commands scoped to it.
        Schema::create('project_environments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained('projects');
            $table->string('label');
            $table->timestampTz('created_at')->nullable();
            $table->unique(['project_id', 'label']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_environments');
        Schema::dropIfExists('projects');
    }
};
