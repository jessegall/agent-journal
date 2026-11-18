<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_context_epochs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('session_id')->unique();
            $table->unsignedInteger('epoch');
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_context_epochs');
    }
};
