<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('share_members', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('share_id')->constrained('shares')->cascadeOnDelete();
            $table->unsignedInteger('scope_version');
            $table->ulid('link_id');
            $table->string('source_type');
            $table->string('source_id');
            $table->string('target_type');
            $table->string('target_id');
            $table->timestampTz('invalidated_at')->nullable();
            $table->timestampsTz();

            $table->index(['share_id', 'scope_version']);

            $table->index('link_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('share_members');
    }
};
