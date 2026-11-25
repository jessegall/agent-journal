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
        Schema::create('navigation_requests', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('driver_request_id');
            $table->ulid('agent_runtime_id');
            $table->string('operation_key');
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('family', 64);
            $table->string('build', 80);
            $table->string('fingerprint', 80);
            $table->string('goal_script');
            $table->unsignedInteger('goal_version');
            $table->json('goal_parameters');
            $table->char('goal_key', 64);
            $table->unsignedInteger('stalled_step');
            $table->string('reason', 16);
            $table->json('screen');
            $table->json('raise_rows');
            $table->string('status', 16);
            $table->string('completes', 8)->nullable();
            $table->unsignedInteger('next_step')->nullable();
            $table->string('proof', 200)->nullable();
            $table->string('abandon_reason', 500)->nullable();
            $table->ulid('stale_entry_id')->nullable();
            $table->json('sent_steps');
            $table->ulid('library_entry_id')->nullable();
            $table->timestampTz('expires_at');
            $table->unsignedInteger('row_version')->default(1);
            $table->timestampsTz();

            $table->unique(['agent_runtime_id', 'operation_key']);
            $table->index(['actor_type', 'actor_id', 'family', 'build', 'fingerprint', 'goal_key']);
        });

        // One open request per runtime: a second is refused by the database, not by a check that could race.
        DB::statement('CREATE UNIQUE INDEX navigation_requests_one_open ON navigation_requests (agent_runtime_id) '
            ."WHERE status IN ('open', 'answering', 'proving')");
    }

    public function down(): void
    {
        Schema::dropIfExists('navigation_requests');
    }
};
