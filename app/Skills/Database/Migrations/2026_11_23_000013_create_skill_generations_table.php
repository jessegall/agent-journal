<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_generations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('catalogue_digest', 64);
            $table->string('registration_digest', 64);
            $table->json('entries');
            $table->string('state', 16);
            $table->text('error_reason')->nullable();
            $table->timestampsTz();

            $table->index(['state', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_generations');
    }
};
