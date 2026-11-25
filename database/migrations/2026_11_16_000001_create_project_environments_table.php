<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The environments of a connected project; every binding works in one, its commands scoped to it.
        Schema::create('project_environments', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained('projects')->restrictOnDelete();
            $table->string('label');
            $table->timestampTz('created_at')->nullable();
            $table->unique(['project_id', 'label']);
            // Lets a table name an environment together with its project in one foreign key.
            $table->unique(['id', 'project_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_environments');
    }
};
