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
            $table->ulid('agent_id')->index();
            $table->text('text');
            $table->unsignedSmallInteger('weight');
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);
        });

        DB::statement('ALTER TABLE memories ADD CONSTRAINT memories_number_positive CHECK (number > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('memories');
    }
};
