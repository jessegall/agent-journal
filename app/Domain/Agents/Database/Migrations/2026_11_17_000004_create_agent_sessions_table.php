<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agent_sessions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id')->index();
            $table->unsignedBigInteger('parent_session_id')->nullable()->index();
            $table->string('program', 32)->nullable();
            $table->string('program_session_id')->nullable();
            $table->string('status', 16)->default('active');
            $table->timestampTz('ended_at')->nullable();
            $table->timestampsTz();

            $table->unique(['program', 'program_session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agent_sessions');
    }
};
