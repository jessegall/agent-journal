<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workspace_reads', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('read_reference', 200)->unique();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('work', 200);
            $table->boolean('available')->nullable();
            $table->boolean('dirty')->nullable();
            $table->boolean('clean')->nullable();
            $table->unsignedInteger('generation')->nullable();
            $table->timestampTz('sampled_at')->nullable();
            $table->timestampsTz();
            $table->index(['actor_type', 'actor_id', 'sampled_at']);
            $table->unsignedSmallInteger('observation_version')->default(1);
            $table->string('binding_id')->default('');
            $table->string('checkout_id')->default('');
            $table->string('head_oid')->default('');
            $table->string('unavailable_reason')->default('');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workspace_reads');
    }
};
