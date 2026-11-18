<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('module_note_pages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->text('text');
            $table->timestamps();

            $table->unique(['number_group_id', 'number']);
        });

        Schema::create('module_note_snapshots', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->text('text');
            $table->timestamps();

            $table->unique(['number_group_id', 'number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_note_snapshots');
        Schema::dropIfExists('module_note_pages');
    }
};
