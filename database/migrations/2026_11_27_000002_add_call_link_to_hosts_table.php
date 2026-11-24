<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * How each host's calls reach the journal: when the journal last answered one, since when its answers fail and why,
 * and the failures the host itself reported on its next answered call.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hosts', function (Blueprint $table): void {
            $table->timestampTz('last_answered_at')->nullable();
            $table->timestampTz('failing_since')->nullable();
            $table->text('last_failure')->nullable();
            $table->jsonb('reported_failures')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('hosts', function (Blueprint $table): void {
            $table->dropColumn(['last_answered_at', 'failing_since', 'last_failure', 'reported_failures']);
        });
    }
};
