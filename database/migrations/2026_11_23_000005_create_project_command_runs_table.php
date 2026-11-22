<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // One journal verb a connected machine ran on the server, by the request id it sent, so a repeat returns the
        // first result instead of running it again.
        Schema::create('project_command_runs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('request_key')->unique();
            $table->string('agent_id');
            $table->foreignUlid('binding_id')->constrained('project_bindings');
            $table->jsonb('argv');
            $table->string('state');
            $table->unsignedInteger('pid')->nullable();
            $table->integer('exit_code')->nullable();
            $table->jsonb('frames')->default('[]');
            $table->timestampsTz();
            $table->string('fingerprint', 64)->default('');
            $table->string('worker')->default('');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_command_runs');
    }
};
