<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('record_type', 64);
            $table->ulid('record_id');
            $table->string('holder_type', 16);
            $table->ulid('holder_id');
            $table->timestampsTz();

            $table->unique(['record_type', 'record_id']);
            $table->index(['holder_type', 'holder_id', 'record_type', 'record_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
