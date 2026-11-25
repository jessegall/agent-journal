<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // One project folder on one machine, joined to a project through that machine's host.
        Schema::create('project_bindings', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('host_id')->constrained('hosts');
            $table->foreignUlid('project_id')->constrained('projects')->restrictOnDelete();
            $table->foreignUlid('main_agent_id')->constrained('agents');
            // The opaque id the relay gives the folder; the canonical path stays out of labels and logs.
            $table->string('root_id');
            $table->text('canonical_root');
            $table->string('project_label');
            $table->string('machine_label');
            $table->string('installation_nonce')->unique();
            $table->unsignedInteger('authority_generation')->default(1);
            $table->string('readiness')->default('pending');
            $table->timestampTz('last_contact_at')->nullable();
            $table->timestampTz('presence_expires_at')->nullable();
            $table->string('boot_id')->nullable();
            $table->unsignedBigInteger('report_sequence')->default(0);
            // Raised by every new boot of the relay, so a report of an older boot is told apart.
            $table->unsignedInteger('boot_generation')->default(0);
            $table->timestampsTz();
            $table->unique(['host_id', 'root_id']);
            $table->foreignUlid('environment_id')->nullable()->constrained('project_environments');
            $table->unsignedInteger('setup_generation')->default(0);
            $table->string('reconciled_boot_id')->nullable();
            $table->string('leased_runtime_id')->nullable();
            $table->timestampTz('lease_expires_at')->nullable();
            $table->timestampTz('revoked_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_bindings');
    }
};
