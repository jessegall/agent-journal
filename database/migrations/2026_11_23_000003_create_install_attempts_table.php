<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // An owner's attempt to install a line for one target, made before any ticket; it never holds a secret.
        Schema::create('install_attempts', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('reference')->unique();
            $table->string('owner_user_id');
            // The owner's key for one action: two first submissions under it make one attempt.
            $table->string('idempotency_key');
            $table->string('mode');
            $table->foreignUlid('project_id')->nullable()->constrained('projects')->restrictOnDelete();
            $table->foreignUlid('environment_id')->nullable()->constrained('project_environments')->nullOnDelete();
            $table->string('status');
            $table->foreignUlid('binding_id')->nullable()->constrained('project_bindings');
            $table->unsignedInteger('version')->default(0);
            $table->timestampsTz();
            $table->unique(['owner_user_id', 'idempotency_key']);
            $table->index(['owner_user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('install_attempts');
    }
};
