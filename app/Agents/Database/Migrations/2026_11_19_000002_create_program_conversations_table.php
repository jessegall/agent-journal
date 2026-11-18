<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_conversations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('program', 32);
            $table->string('settings_identity', 128);
            $table->string('native_id');
            $table->ulid('agent_id')->index();
            $table->string('context_reference', 128)->nullable();
            $table->timestampsTz();

            $table->unique(['program', 'settings_identity', 'native_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_conversations');
    }
};
