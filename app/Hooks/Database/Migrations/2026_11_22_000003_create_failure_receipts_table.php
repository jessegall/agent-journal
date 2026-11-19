<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('failure_receipts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('agent_id');
            $table->ulid('session_id');
            $table->string('event_id', 128);
            $table->string('failure', 32);
            $table->timestampsTz();

            $table->unique(['agent_id', 'session_id', 'event_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('failure_receipts');
    }
};
