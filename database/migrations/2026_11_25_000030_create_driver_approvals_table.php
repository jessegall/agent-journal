<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The owner approved a third-party driver registration and the builds of it a host may run.
        Schema::create('driver_approvals', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('driver_key', 128)->unique();
            $table->json('build_pins');
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('driver_approvals');
    }
};
