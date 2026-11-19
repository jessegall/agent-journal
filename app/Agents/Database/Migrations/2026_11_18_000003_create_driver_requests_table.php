<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('driver_requests', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('agent_runtime_id');
            $table->unsignedBigInteger('sequence');
            $table->string('operation', 16);
            $table->string('idempotency_key');
            $table->char('payload_digest', 64);
            $table->text('message')->nullable();
            $table->string('model')->nullable();
            $table->string('effort', 32)->nullable();
            $table->string('progress', 32);
            $table->string('outcome', 32)->nullable();
            $table->string('expected_timing', 32);
            $table->timestampTz('expected_observed_at')->nullable();
            $table->string('actual_binding', 32)->nullable();
            $table->unsignedInteger('attempt_version')->default(0);
            $table->unsignedBigInteger('wake_requested')->default(0);
            $table->unsignedBigInteger('wake_acknowledged')->default(0);
            $table->unsignedBigInteger('wake_claimed')->nullable();
            $table->timestampTz('staged_at')->nullable();
            $table->string('script_id')->nullable();
            $table->unsignedInteger('script_version')->nullable();
            $table->unsignedInteger('script_step')->nullable();
            $table->json('script_parameters');
            $table->unsignedBigInteger('script_generation')->nullable();
            $table->string('script_evidence', 500)->nullable();
            $table->string('hold_reason', 32);
            $table->unsignedInteger('row_version')->default(1);
            $table->timestampsTz();

            $table->unique(['agent_runtime_id', 'sequence']);
            $table->unique(['agent_runtime_id', 'idempotency_key']);
        });

        // One open wake per runtime: a second is refused by the database, not by a check that could race.
        DB::statement("CREATE UNIQUE INDEX driver_requests_one_open_wake ON driver_requests (agent_runtime_id) WHERE operation = 'wake' AND progress IN ('accepted', 'staged', 'applying')");
    }

    public function down(): void
    {
        Schema::dropIfExists('driver_requests');
    }
};
