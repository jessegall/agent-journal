<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sequences', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('summary')->default('');
            $table->jsonb('steps');
            $table->unsignedInteger('version')->default(1);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sequences');
    }
};
