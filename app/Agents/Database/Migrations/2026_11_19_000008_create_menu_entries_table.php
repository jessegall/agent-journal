<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_entries', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('program', 80);
            $table->string('entry_fingerprint', 80);
            $table->string('goal_script');
            $table->unsignedInteger('goal_version');
            $table->json('goal_parameters');
            $table->char('goal_key', 64);
            $table->json('steps');
            $table->string('completes', 8);
            $table->unsignedInteger('next_step')->nullable();
            $table->string('proof', 200);
            $table->string('state', 16);
            $table->json('builds');
            $table->unsignedInteger('uses')->default(0);
            $table->timestampTz('last_used_at')->nullable();
            $table->string('last_replay_key')->nullable();
            $table->ulid('source_request_id');
            $table->ulid('superseded_by_id')->nullable();
            $table->timestampsTz();

            $table->index(['actor_type', 'actor_id', 'program', 'entry_fingerprint', 'goal_key', 'state']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_entries');
    }
};
