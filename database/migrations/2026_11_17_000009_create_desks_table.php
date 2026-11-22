<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('desks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name', 64)->nullable()->unique();
            $table->string('label');
            $table->foreignUlid('inbox_id')->unique()->constrained('inboxes')->restrictOnDelete();
            $table->unsignedSmallInteger('seat_count');
            $table->boolean('forwards_occupants');
            $table->unsignedInteger('seating_revision')->default(0);
            $table->timestampsTz();
        });

        DB::statement('ALTER TABLE desks ADD CONSTRAINT desks_seat_count_range CHECK (seat_count BETWEEN 0 AND 100)');

        Schema::create('desk_seats', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('desk_id')->constrained('desks')->cascadeOnDelete();
            $table->unsignedSmallInteger('number');
            $table->timestampsTz();

            $table->unique(['desk_id', 'number']);
        });

        Schema::create('desk_preferences', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->foreignUlid('desk_id')->constrained('desks')->cascadeOnDelete();
            $table->timestampsTz();

            $table->unique(['actor_type', 'actor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('desk_preferences');
        Schema::dropIfExists('desk_seats');
        Schema::dropIfExists('desks');
    }
};
