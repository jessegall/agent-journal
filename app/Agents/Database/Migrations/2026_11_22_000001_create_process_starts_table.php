<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('process_starts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('agent_id');
            $table->ulid('session_id');
            $table->ulid('host_id')->nullable();
            $table->string('start_key', 64)->unique();
            $table->string('account_type', 64);
            $table->ulid('account_id');
            $table->unsignedBigInteger('account_generation');
            $table->string('directory');
            $table->string('state', 32);
            $table->string('role', 32);
            $table->ulid('owner_start_id')->nullable();
            $table->string('execution_id', 128)->nullable();
            $table->unsignedInteger('output_generation')->default(0);
            $table->timestampTz('ended_at')->nullable();
            $table->timestampsTz();

            $table->index(['account_type', 'account_id', 'state']);
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('process_starts');
    }
};
