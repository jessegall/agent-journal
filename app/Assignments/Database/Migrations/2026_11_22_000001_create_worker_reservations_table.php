<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('worker_reservations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('holder_type', 16);
            $table->string('holder_id', 64);
            $table->string('root_type', 64)->nullable();
            $table->string('root_id', 64)->nullable();
            $table->timestampsTz();

            $table->unique(['holder_type', 'holder_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worker_reservations');
    }
};
