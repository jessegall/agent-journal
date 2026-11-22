<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certified_works', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('work_type', 64);
            $table->string('work_id', 64);
            $table->string('certificate', 64)->unique();
            $table->ulid('agent_session_id');
            $table->string('worktree', 1024);
            $table->timestampsTz();
            $table->index(['work_type', 'work_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certified_works');
    }
};
