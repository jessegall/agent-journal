<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_occurrences', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('occurrence_key', 191)->unique();
            $table->string('source_type', 32);
            $table->string('target_key', 64);
            $table->string('target_id', 64);
            $table->timestampTz('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_occurrences');
    }
};
