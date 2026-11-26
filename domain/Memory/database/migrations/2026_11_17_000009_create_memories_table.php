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
        Schema::create('memories', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->text('text');
            $table->unsignedSmallInteger('weight');
            $table->unsignedInteger('revision')->default(1);
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);

            $table->index(['actor_type', 'actor_id']);
        });

        DB::statement('ALTER TABLE memories ADD CONSTRAINT memories_number_positive CHECK (number > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('memories');
    }
};
