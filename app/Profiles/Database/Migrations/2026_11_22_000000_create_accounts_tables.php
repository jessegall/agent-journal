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
        Schema::create('accounts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('driver', 64);
            $table->string('method', 32)->default('oauth');
            $table->string('label', 80);
            $table->string('label_key', 80);
            $table->string('state', 32);
            $table->string('directory')->nullable();
            $table->string('identity')->nullable();
            $table->string('subject')->nullable();
            $table->string('workspace')->nullable();
            $table->string('fingerprint', 64)->nullable();
            $table->timestampTz('expires_at')->nullable();
            $table->boolean('maintenance')->default(false);
            $table->unsignedBigInteger('sign_in_generation')->default(0);
            $table->ulid('live_writer_attempt_id')->nullable();
            $table->ulid('operation_id')->nullable();
            $table->boolean('cleanup_pending')->default(false);
            $table->boolean('cleanup_released')->default(false);
            $table->boolean('store_removed')->default(false);
            $table->unsignedSmallInteger('cleanup_tries')->default(0);
            $table->string('cleanup_problem', 32)->nullable();
            $table->unsignedBigInteger('check_requested_generation')->nullable();
            $table->timestampTz('checked_at')->nullable();
            $table->timestampsTz();

            $table->index('driver');
        });
        DB::statement("create unique index accounts_label_in_use on accounts (driver, label_key) where state <> 'removed'");

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

        Schema::create('active_accounts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('driver', 64)->unique();
            $table->ulid('account_id')->nullable();
            $table->boolean('has_selected')->default(false);
            $table->unsignedBigInteger('change_number')->default(0);
            $table->timestampsTz();
        });

        Schema::create('sign_in_attempts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('driver', 64);
            $table->string('method', 32);
            $table->string('actor_type', 16);
            $table->string('actor_id', 64);
            $table->string('fingerprint', 64)->nullable();
            $table->ulid('account_id')->nullable();
            $table->string('state', 32);
            $table->string('request_key', 128)->unique();
            $table->unsignedBigInteger('generation')->default(0);
            $table->string('directory')->nullable();
            $table->string('process_reference')->nullable();
            $table->string('login_reference')->nullable();
            $table->boolean('cleanup_pending')->default(false);
            $table->boolean('waits_for_uses')->default(false);
            $table->boolean('store_removed')->default(false);
            $table->unsignedSmallInteger('cleanup_tries')->default(0);
            $table->string('cleanup_problem', 32)->nullable();
            $table->timestampTz('expires_at');
            $table->timestampsTz();

            $table->index(['driver', 'state']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sign_in_attempts');
        Schema::dropIfExists('active_accounts');
        Schema::dropIfExists('account_usage_tokens');
        Schema::dropIfExists('account_usage_costs');
        Schema::dropIfExists('account_usage_windows');
        Schema::dropIfExists('accounts');
    }
};
