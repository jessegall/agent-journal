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
            $table->ulid('session_id');
            $table->unsignedSmallInteger('contract_major');
            $table->string('request_key', 128);
            $table->string('command');
            $table->char('fingerprint', 64);
            $table->string('state', 16);
            $table->json('result')->nullable();
            $table->string('refusal_code', 32)->nullable();
            $table->text('refusal_message')->nullable();
            $table->string('author_type', 16);
            $table->string('author_id', 64);
            $table->timestampsTz();

            $table->unique(['session_id', 'contract_major', 'request_key']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('command_receipts');
    }
};
