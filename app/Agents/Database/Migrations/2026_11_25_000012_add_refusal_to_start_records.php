<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The receipt of a refused start: its stable reason code and when it was refused, kept after the rollback.
        Schema::table('start_records', function (Blueprint $table) {
            $table->string('refusal_reason', 48)->nullable();
            $table->timestampTz('refused_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('start_records', function (Blueprint $table) {
            $table->dropColumn(['refusal_reason', 'refused_at']);
        });
    }
};
