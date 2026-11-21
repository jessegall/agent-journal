<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('report_job_links', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('report_id')->unique();
            $table->unsignedBigInteger('report_number');
            $table->foreignUlid('helper_job_id')->constrained('helper_jobs')->restrictOnDelete();
            $table->string('dispatch_request_id', 64);
            $table->timestampTz('verified_at');
            $table->timestampTz('created_at')->nullable();
        });

        Schema::create('report_job_discrepancies', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('report_id')->index();
            $table->string('owner_reference', 128);
            $table->string('filer_type', 16);
            $table->string('filer_id', 64);
            $table->string('reason', 32);
            $table->timestampTz('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_job_discrepancies');
        Schema::dropIfExists('report_job_links');
    }
};
