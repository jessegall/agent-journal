<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Each step of connecting a project: who took it, on what, and how it ended; never a ticket, credential or path.
        Schema::create('connection_audits', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('type');
            $table->string('actor_type');
            $table->string('actor_id');
            $table->foreignUlid('invitation_id')->nullable()->constrained('project_invitations');
            $table->foreignUlid('binding_id')->nullable()->constrained('project_bindings');
            $table->string('outcome');
            $table->timestampTz('created_at');

            $table->index('created_at');
            $table->string('project_id')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('connection_audits');
    }
};
