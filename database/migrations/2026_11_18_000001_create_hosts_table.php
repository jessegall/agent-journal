<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hosts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('installation_name');
            $table->char('credential_hash', 64)->unique();
            $table->jsonb('start_roots');
            $table->string('arrangement')->default('local');
            // The host protocol the host speaks, and the secret every instruction to it is signed with.
            $table->unsignedSmallInteger('protocol')->default(1);
            $table->text('instruction_secret')->nullable();
            // The instruction types the host's last inventory names as carried out; empty until its first inventory.
            $table->jsonb('capabilities')->default('[]');
            $table->jsonb('allowed_images')->default('[]');
            // The release the host's last inventory named, the release an upgrade waits on, its instruction and why one failed.
            $table->string('release')->nullable();
            $table->string('upgrade_release')->nullable();
            $table->ulid('upgrade_instruction_id')->nullable();
            $table->text('upgrade_failure')->nullable();
            // The combinations the host reported it can run, and whether its last claim offers browser control of its
            // terminals.
            $table->timestampTz('revoked_at')->nullable();
            $table->timestampTz('last_answered_at')->nullable();
            $table->timestampTz('failing_since')->nullable();
            // When the host's last protocol 1 heartbeat arrived.
            $table->timestampTz('last_heartbeat_at')->nullable();
            $table->text('last_failure')->nullable();
            $table->jsonb('reported_failures')->nullable();
            $table->string('failing_route')->nullable();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hosts');
    }
};
