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
            $table->foreignUlid('project_id')->constrained('projects');
            $table->string('label');
            $table->timestampTz('created_at')->nullable();
            $table->unique(['project_id', 'label']);
        });

        // Bindings, lines and terminal sign-ins are made before this table and name their environment through it.
        Schema::table('project_bindings', function (Blueprint $table): void {
            $table->foreign('environment_id')->references('id')->on('project_environments');
        });

        Schema::table('project_invitations', function (Blueprint $table): void {
            $table->foreign('environment_id')->references('id')->on('project_environments')->nullOnDelete();
        });

        Schema::table('device_grants', function (Blueprint $table): void {
            $table->foreign('environment_id')->references('id')->on('project_environments')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('project_bindings', fn (Blueprint $table) => $table->dropForeign(['environment_id']));
        Schema::table('project_invitations', fn (Blueprint $table) => $table->dropForeign(['environment_id']));
        Schema::table('device_grants', fn (Blueprint $table) => $table->dropForeign(['environment_id']));

        Schema::dropIfExists('project_environments');
    }
};
