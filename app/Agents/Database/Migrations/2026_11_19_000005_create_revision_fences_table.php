<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('revision_fences', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('revision_reference', 64)->unique();
            $table->timestampTz('reconciled_at')->nullable();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('revision_fences');
    }
};
