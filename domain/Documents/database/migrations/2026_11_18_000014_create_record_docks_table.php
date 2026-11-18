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
        Schema::create('record_docks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('recipient_type', 16);
            $table->string('recipient_id');
            $table->string('parent_type', 32);
            $table->ulid('parent_id');
            $table->string('docked_by_type', 16);
            $table->ulid('docked_by_id');
            $table->timestampTz('docked_at');
            $table->boolean('hidden_from_dock')->default(false);
            $table->timestampsTz();

            $table->unique(['recipient_type', 'recipient_id', 'parent_type', 'parent_id'], 'record_docks_recipient_record_unique');
            $table->index(['recipient_type', 'recipient_id', 'hidden_from_dock', 'docked_at', 'id'], 'record_docks_recipient_order');
        });

        DB::statement("ALTER TABLE record_docks ADD CONSTRAINT record_docks_parent_type CHECK (parent_type IN ('documents.document', 'documents.report'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('record_docks');
    }
};
