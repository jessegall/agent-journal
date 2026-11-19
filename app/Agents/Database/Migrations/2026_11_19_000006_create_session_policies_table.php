<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_policies', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('session_id')->unique();
            $table->string('profile_key', 64)->nullable();
            $table->unsignedInteger('profile_revision')->nullable();
            $table->char('configuration_hash', 64)->nullable();
            $table->json('access_policy');
            $table->json('stop_conditions');
            $table->json('execution_policy');
            $table->char('policy_digest', 64);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_policies');
    }
};
