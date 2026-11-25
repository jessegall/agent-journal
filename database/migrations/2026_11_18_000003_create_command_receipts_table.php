<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('command_receipts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('author_type', 16);
            $table->string('author_id', 64);
            $table->ulid('session_id')->nullable();
            $table->unsignedSmallInteger('contract_major');
            $table->string('request_key', 128);
            $table->string('command');
            $table->char('fingerprint', 64);
            $table->string('status', 16);
            $table->json('result')->nullable();
            $table->string('refusal_code', 32)->nullable();
            $table->text('refusal_message')->nullable();
            $table->json('refusal_recovery')->nullable();
            $table->timestampTz('answers_until');
            $table->timestampTz('refuses_until')->nullable();
            $table->timestampsTz();

            $table->unique(
                ['author_type', 'author_id', 'session_id', 'command', 'contract_major', 'request_key'],
            )->nullsNotDistinct();

            $table->index('answers_until');
            $table->index('refuses_until');
            $table->string('target', 160)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('command_receipts');
    }
};
