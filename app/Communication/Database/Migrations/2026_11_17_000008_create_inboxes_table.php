<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inboxes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('provider_key', 64);
            $table->string('provider_id');
            $table->unsignedBigInteger('next_sequence')->default(0);
            $table->timestampsTz();

            $table->unique(['provider_key', 'provider_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inboxes');
    }
};
