<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('title');
            $table->timestampTz('due_at');
            $table->string('status', 16);
            $table->timestampsTz();

            $table->index([
                'actor_type',
                'actor_id',
                'due_at',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
