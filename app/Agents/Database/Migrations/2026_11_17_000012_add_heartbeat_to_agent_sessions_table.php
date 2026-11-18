<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agent_sessions', function (Blueprint $table) {
            $table->timestampTz('last_heartbeat_at')->nullable();
            $table->timestampTz('suspected_lost_at')->nullable();
            $table->string('loss_evidence')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('agent_sessions', function (Blueprint $table) {
            $table->dropColumn(['last_heartbeat_at', 'suspected_lost_at', 'loss_evidence']);
        });
    }
};
