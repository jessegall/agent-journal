<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_reads', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('binding_id')->index()->constrained('project_bindings')->cascadeOnDelete();
            $table->string('type', 16);
            $table->string('path', 1024);
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('status', 16);
            $table->string('failure', 32)->nullable();
            $table->json('entries')->nullable();
            $table->longText('text')->nullable();
            $table->string('digest', 64)->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->boolean('is_truncated')->default(false);
            $table->timestampTz('answered_at')->nullable();
            $table->timestampTz('expires_at');
            $table->timestampsTz();

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_reads');
    }
};
