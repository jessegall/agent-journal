<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('host_orders', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('host_id')->constrained('hosts');
            $table->foreignUlid('host_process_id')->nullable()->constrained('host_processes');
            $table->ulid('driver_request_id')->nullable()->index();
            $table->string('step')->nullable();
            // The request, its step and the attempt: a repeated step makes no second order.
            $table->string('idempotency_key')->unique();
            $table->unsignedBigInteger('sequence');
            $table->string('type', 24);
            $table->text('payload');
            // What the payload keeps once the host answered: an input's bytes and an opening's credentials are left out.
            $table->text('kept_payload');
            $table->timestampTz('expires_at');
            $table->string('status', 16);
            $table->string('refusal', 24)->nullable();
            $table->jsonb('answer')->nullable();
            $table->timestampTz('claimed_at')->nullable();
            $table->timestampTz('answered_at')->nullable();
            $table->timestampsTz();
            $table->index(['host_id', 'status', 'sequence']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('host_orders');
    }
};
