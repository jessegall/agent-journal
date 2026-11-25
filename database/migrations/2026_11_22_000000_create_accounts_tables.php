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
            $table->string('account_protocol', 64);
            $table->string('method', 32)->default('oauth');
            $table->string('label', 80);
            $table->string('label_key', 80);
            $table->string('status', 32);
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

            $table->index('account_protocol');
            $table->timestampTz('check_inconclusive_at')->nullable();
            $table->unsignedInteger('name_revision')->default(0);
        });

        DB::statement("create unique index accounts_label_in_use on accounts (account_protocol, label_key) where status <> 'removed'");

        Schema::create('active_accounts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('account_protocol', 64)->unique();
            $table->ulid('account_id')->nullable();
            $table->boolean('has_selected')->default(false);
            $table->unsignedBigInteger('change_number')->default(0);
            $table->timestampsTz();
        });

        Schema::create('sign_in_attempts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('account_protocol', 64);
            $table->string('method', 32);
            $table->string('actor_type', 16);
            $table->string('actor_id', 64);
            $table->string('fingerprint', 64)->nullable();
            $table->ulid('account_id')->nullable();
            $table->string('status', 32);
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

            $table->index(['account_protocol', 'status']);
            $table->string('refusal', 300)->nullable();
            $table->string('result_account_id', 26)->nullable();
            $table->string('submission_key', 128)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sign_in_attempts');
        Schema::dropIfExists('active_accounts');
        Schema::dropIfExists('accounts');
    }
};
