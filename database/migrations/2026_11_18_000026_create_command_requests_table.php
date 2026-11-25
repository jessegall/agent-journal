<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('command_requests', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('project_key', 64);
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('operation');
            $table->string('binding_digest', 64);
            $table->string('source_digest', 64);
            $table->string('source_excerpt', 200);
            $table->text('source_line');
            $table->text('working_folder');
            $table->string('hold_reason', 32);
            $table->string('status', 32);
            $table->timestampsTz();

            $table->index(['project_key', 'actor_type', 'actor_id', 'operation', 'binding_digest']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('command_requests');
    }
};
