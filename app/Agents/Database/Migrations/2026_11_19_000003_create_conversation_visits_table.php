<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversation_visits', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('session_id');
            $table->ulid('conversation_id')->index();
            $table->unsignedInteger('sequence_number');
            $table->string('event_id', 128);
            $table->timestampTz('observed_at');
            $table->timestampsTz();

            $table->unique(['session_id', 'sequence_number']);
            $table->unique(['session_id', 'event_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversation_visits');
    }
};
