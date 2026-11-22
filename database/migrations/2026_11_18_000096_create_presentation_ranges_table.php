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
        Schema::create('outstanding_ranges', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('receipt_id')->constrained('message_receipts')->cascadeOnDelete();
            $table->unsignedInteger('start_offset');
            $table->unsignedSmallInteger('consecutive_failures')->default(0);
            $table->string('state', 16);
            $table->string('exhausted_reason')->nullable();
            $table->timestampsTz();
        });

        DB::statement(<<<'SQL'
            CREATE UNIQUE INDEX outstanding_ranges_one_open
                ON outstanding_ranges (receipt_id, start_offset)
                WHERE state = 'outstanding'
            SQL);

        Schema::create('presentation_ranges', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('batch_id')->constrained('presentation_batches')->cascadeOnDelete();
            $table->foreignUlid('outstanding_range_id')->constrained('outstanding_ranges')->cascadeOnDelete();
            $table->foreignUlid('receipt_id')->constrained('message_receipts')->cascadeOnDelete();
            $table->unsignedInteger('start_offset');
            $table->unsignedInteger('end_offset');
            $table->char('handle_digest', 64)->unique();
            $table->timestampTz('confirmed_at')->nullable();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presentation_ranges');
        Schema::dropIfExists('outstanding_ranges');
    }
};
