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
            // The latest protection report per driver and build (journal-agent protection), as a contained host sent it.
            $table->jsonb('protection')->default('{}');
            $table->string('arrangement')->default('local');
            // The host protocol the host speaks, and the secret every order to it is signed with.
            $table->unsignedSmallInteger('protocol')->default(1);
            $table->text('order_secret')->nullable();
            // The order types the host's last inventory said it carries out; empty until its first inventory.
            $table->jsonb('capabilities')->default('[]');
            // The combinations the host reported it can run.
            // Whether the host's last claim said it carries out browser control of its terminals.
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
