<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('phase_checks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('phase_id')->constrained('phases')->cascadeOnDelete();
            $table->string('operation');
            $table->string('receipt_id', 26);
            $table->string('outcome', 16);
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->timestampTz('recorded_at');

            $table->unique(['phase_id', 'receipt_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phase_checks');
    }
};
