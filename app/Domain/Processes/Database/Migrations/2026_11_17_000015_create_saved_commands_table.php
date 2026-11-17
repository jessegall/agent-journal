<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('saved_commands', function (Blueprint $table) {
            $table->id();
            $table->string('name', 64)->unique();
            $table->text('line');
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_commands');
    }
};
