<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('record_settlements', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('parent_type', 32);
            $table->ulid('parent_id');
            $table->string('actor_type', 16);
            $table->ulid('actor_id');
            $table->string('reason', 2000);
            $table->unsignedBigInteger('revision_number')->nullable();
            $table->timestampTz('settled_at');
            $table->timestampsTz();

            $table->index(['parent_type', 'parent_id', 'settled_at', 'id'], 'record_settlements_parent_order');
        });

        DB::statement('ALTER TABLE record_settlements ADD CONSTRAINT record_settlements_parent_type CHECK '
            ."(parent_type IN ('documents.document', 'documents.report'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('record_settlements');
    }
};
