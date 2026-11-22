<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The usage each account's hosts observe: its limit windows, its cost entries and its threads' token totals.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('account_usage_windows', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('account_id')->constrained('accounts');
            $table->unsignedBigInteger('sign_in_generation');
            $table->string('limit_id', 64);
            $table->string('slot', 16);
            $table->decimal('used_percent', 7, 4)->nullable();
            $table->unsignedInteger('duration_minutes')->nullable();
            $table->timestampTz('resets_at')->nullable();
            $table->timestampTz('observed_at');
            $table->string('source_id', 128);
            $table->unsignedBigInteger('source_order');
            $table->timestampsTz();

            $table->unique(['account_id', 'sign_in_generation', 'limit_id', 'slot']);
        });

        Schema::create('account_usage_costs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('account_id')->constrained('accounts');
            $table->unsignedBigInteger('sign_in_generation');
            $table->string('source_id', 128);
            $table->decimal('usd', 24, 12);
            $table->timestampTz('observed_at');
            $table->timestampsTz();

            $table->unique(['account_id', 'sign_in_generation', 'source_id']);
            $table->index(['account_id', 'observed_at']);
        });

        Schema::create('account_usage_tokens', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('account_id')->constrained('accounts');
            $table->unsignedBigInteger('sign_in_generation');
            $table->string('thread_id', 128);
            $table->unsignedBigInteger('total');
            $table->unsignedBigInteger('input')->nullable();
            $table->unsignedBigInteger('cached_input')->nullable();
            $table->unsignedBigInteger('output')->nullable();
            $table->unsignedBigInteger('reasoning_output')->nullable();
            $table->unsignedBigInteger('last_turn_total')->nullable();
            $table->timestampTz('observed_at');
            $table->string('source_id', 128);
            $table->unsignedBigInteger('source_order');
            $table->timestampsTz();

            $table->unique(['account_id', 'sign_in_generation', 'thread_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('account_usage_tokens');
        Schema::dropIfExists('account_usage_costs');
        Schema::dropIfExists('account_usage_windows');
    }
};
