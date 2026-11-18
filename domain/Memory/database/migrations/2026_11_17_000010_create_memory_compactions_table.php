<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memory_compactions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('compaction_key', 128);
            $table->timestampsTz();

            $table->unique(['actor_type', 'actor_id', 'compaction_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memory_compactions');
    }
};
