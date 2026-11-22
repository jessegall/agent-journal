<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permission_revocations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('permission_source');
            $table->jsonb('revoked_classes');
            $table->jsonb('revoked_patterns');
            $table->string('revoked_by_type', 16);
            $table->string('revoked_by_id');
            $table->timestampTz('revoked_at');
            $table->timestampsTz();

            $table->index('permission_source');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permission_revocations');
    }
};
