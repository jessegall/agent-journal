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
            // The combinations the host reported it can run.
            $table->jsonb('descriptors')->default('[]');
            // Whether the host's last claim said it carries out browser control of its terminals.
            $table->boolean('browser_input')->default(false);
            $table->boolean('browser_keys')->default(false);
            $table->boolean('browser_paste')->default(false);
            $table->boolean('browser_resize')->default(false);
            $table->boolean('browser_private')->default(false);
            $table->timestampTz('revoked_at')->nullable();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hosts');
    }
};
