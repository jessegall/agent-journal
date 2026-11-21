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
    }

    public function down(): void
    {
        Schema::dropIfExists('report_job_links');
    }
};
