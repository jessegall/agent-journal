<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agents', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->foreignUlid('project_id')->constrained('projects')->restrictOnDelete();
            $table->string('profile_key', 64);
            $table->timestampTz('retired_at')->nullable();
            $table->ulid('current_session_id')->nullable();
            $table->unsignedInteger('runtime_generation')->default(0);
            $table->string('driver_type_preference', 16)->nullable();
            $table->timestampsTz();
            // Lets a table name an agent together with its project in one foreign key.
            $table->unique(['id', 'project_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agents');
    }
};
