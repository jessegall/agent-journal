<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('capacity_reservations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('start_request_id')->unique();
            $table->unsignedInteger('cpu_cores');
            $table->unsignedBigInteger('memory_bytes');
            $table->unsignedBigInteger('disk_bytes');
            $table->string('state', 16)->index();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capacity_reservations');
    }
};
