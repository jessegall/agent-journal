<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('command_aliases', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('project_key', 64);
            $table->string('name', 64);
            $table->text('line');
            $table->unsignedInteger('revision')->default(1);
            $table->string('body_digest', 64);
            $table->json('argument_grammar');
            $table->timestampsTz();
            $table->unique(['project_key', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('command_aliases');
    }
};
