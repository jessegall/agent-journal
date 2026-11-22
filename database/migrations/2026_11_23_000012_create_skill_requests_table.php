<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_requests', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('actor_type', 16);
            $table->string('actor_id');
            $table->string('request_id', 64);
            $table->string('input_digest', 64);
            $table->foreignUlid('skill_id')->constrained('skills')->cascadeOnDelete();
            $table->foreignUlid('skill_revision_id')->constrained('skill_revisions')->cascadeOnDelete();
            $table->timestampsTz();

            $table->unique(['actor_type', 'actor_id', 'request_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_requests');
    }
};
