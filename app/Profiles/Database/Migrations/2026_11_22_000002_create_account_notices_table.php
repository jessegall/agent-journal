<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('account_notices', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('program', 64);
            $table->string('reason', 64);
            $table->unsignedInteger('times')->default(1);
            $table->timestampTz('resolved_at')->nullable();
            $table->timestampsTz();

            $table->index(['program', 'reason', 'resolved_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('account_notices');
    }
};
