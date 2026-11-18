<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A planted wrong table: it stores the agent and the session that work on a job.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('planted_jobs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('agent_id')->nullable();
            $table->ulid('origin_session_id')->nullable();
            $table->string('actor_type')->nullable();
        });
    }
};
