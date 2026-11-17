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
            $table->id();
            $table->string('record_type', 64);
            $table->unsignedBigInteger('record_id');
            $table->string('holder_kind', 16);
            $table->unsignedBigInteger('holder_id');
            $table->timestampsTz();

            $table->unique(['record_type', 'record_id']);
            $table->index(['holder_kind', 'holder_id', 'record_type', 'record_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
