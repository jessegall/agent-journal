<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('merge_attempts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('decision_id', 64)->unique();
            $table->string('work_type', 64);
            $table->string('work_id');
            $table->string('certificate', 64);
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('ask_id', 64);
            $table->unsignedInteger('ask_version');
            $table->string('target_branch', 200);
            $table->string('base', 64);
            $table->string('head', 64);
            $table->string('import_ref', 200);
            $table->string('state', 16);
            $table->string('target_before', 64)->nullable();
            $table->string('result', 64)->nullable();
            $table->string('refusal', 32)->nullable();
            $table->text('evidence')->nullable();
            $table->boolean('owner_attested')->default(false);
            $table->timestampTz('acknowledged_at')->nullable();
            $table->timestampsTz();
            $table->index(['state', 'acknowledged_at', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('merge_attempts');
    }
};
