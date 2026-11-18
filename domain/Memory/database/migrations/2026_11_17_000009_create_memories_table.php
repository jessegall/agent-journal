<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memories', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('agent_id')->index();
            $table->text('text');
            $table->unsignedSmallInteger('weight');
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memories');
    }
};
