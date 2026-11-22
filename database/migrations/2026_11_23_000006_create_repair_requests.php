<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_requests', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('source', 80)->unique();
            $table->string('certificate', 64);
            $table->string('work_type', 64);
            $table->string('work_id');
            $table->string('worker_type', 16);
            $table->string('worker_id');
            $table->text('findings');
            $table->string('target_commit', 64)->nullable();
            $table->string('state', 16);
            $table->timestampsTz();
            $table->index(['work_type', 'work_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_requests');
    }
};
