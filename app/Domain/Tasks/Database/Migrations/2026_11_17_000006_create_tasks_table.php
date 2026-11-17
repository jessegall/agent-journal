<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('state', 16)->default('open');
            $table->unsignedInteger('run_number')->default(0);
            $table->unsignedBigInteger('agent_id')->nullable();
            $table->unsignedBigInteger('session_id')->nullable();
            $table->timestampsTz();

            $table->index(['agent_id', 'session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
