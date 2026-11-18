<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings_records', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('owner')->unique();
            $table->unsignedInteger('revision')->default(0);
            $table->json('document');
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings_records');
    }
};
