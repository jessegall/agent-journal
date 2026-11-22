<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inbox_timeline_events', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('inbox_id')->constrained('inboxes')->restrictOnDelete();
            $table->unsignedBigInteger('sequence');
            $table->string('type', 16);
            $table->string('actor_type', 16);
            $table->string('actor_id', 64);
            $table->foreignUlid('interval_id')->nullable()->constrained('inbox_intervals')->restrictOnDelete();
            $table->timestampTz('created_at');

            $table->unique(['inbox_id', 'sequence']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inbox_timeline_events');
    }
};
