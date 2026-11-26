<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('host_processes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('host_id')->constrained('hosts');
            $table->ulid('agent_runtime_id')->nullable()->index();
            // The journal's start record this process runs for; none for a process no start made, such as a probe.
            $table->ulid('session_process_id')->nullable()->index();
            $table->string('purpose', 24);
            $table->string('type', 16);
            $table->unsignedInteger('generation')->default(0);
            $table->string('container_name')->nullable();
            $table->string('restart', 16);
            $table->string('status', 16);
            $table->string('execution_identity')->nullable();
            // Raised by every key the user types, so a guarded write made before it is refused.
            $table->unsignedBigInteger('input_generation')->default(0);
            $table->unsignedBigInteger('output_offset')->default(0);
            // The number of the process's last order: its orders are numbered under this row's lock.
            $table->unsignedBigInteger('order_sequence')->default(0);
            $table->integer('exit_code')->nullable();
            $table->string('exit_signal', 32)->nullable();
            $table->text('exit_evidence')->nullable();
            // Raised by each worker that takes the process over; a worker whose number moved is refused.
            $table->unsignedBigInteger('worker_generation')->default(0);
            $table->timestampTz('worker_until')->nullable();
            $table->ulid('open_order_id')->nullable();
            // How many heartbeats in a row left the process out after its open order was answered.
            $table->unsignedSmallInteger('missed_heartbeats')->default(0);
            $table->timestampTz('started_at')->nullable();
            $table->timestampTz('ended_at')->nullable();
            $table->timestampsTz();
            $table->index(['host_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('host_processes');
    }
};
