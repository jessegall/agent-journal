<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A one-time install line: only the digest of its ticket is kept, never the ticket.
        Schema::create('project_invitations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->char('ticket_digest', 64)->unique();
            $table->string('issuer_user_id');
            $table->string('mode');
            $table->foreignUlid('project_id')->nullable()->constrained('projects');
            // One owner action's key: issuing again under it replaces the line still pending under it.
            $table->string('issuance_key')->index();
            $table->timestampTz('expires_at');
            $table->timestampTz('revoked_at')->nullable();
            $table->timestampTz('spent_at')->nullable();
            $table->foreignUlid('binding_id')->nullable()->constrained('project_bindings');
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_invitations');
    }
};
