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
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('session_id');
            $table->string('compaction_id', 128);
            $table->timestampsTz();

            $table->unique(['agent_id', 'session_id', 'compaction_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memory_compactions');
    }
};
