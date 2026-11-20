<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervisor_links', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->json('routes');
            $table->json('versions');
            $table->timestampsTz();
            $table->unique(['actor_type', 'actor_id']);
        });

        Schema::create('supervisor_changes', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('supervisor_link_id')->constrained();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('route');
            $table->string('previous_target');
            $table->string('target');
            $table->unsignedInteger('version');
            $table->timestampTz('created_at');
            $table->unique(['supervisor_link_id', 'route', 'version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervisor_changes');
        Schema::dropIfExists('supervisor_links');
    }
};
