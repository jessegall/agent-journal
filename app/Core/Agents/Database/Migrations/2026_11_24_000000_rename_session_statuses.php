<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Session statuses say what they mean: suspected_lost becomes silent and lost becomes timed_out, and the columns
 * follow; every session keeps its state.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agent_sessions', function (Blueprint $table): void {
            $table->renameColumn('suspected_lost_at', 'silent_since');
            $table->renameColumn('loss_evidence', 'end_evidence');
        });

        DB::table('agent_sessions')->where('status', 'suspected_lost')->update(['status' => 'silent']);
        DB::table('agent_sessions')->where('status', 'lost')->update(['status' => 'timed_out']);
    }

    public function down(): void
    {
        DB::table('agent_sessions')->where('status', 'silent')->update(['status' => 'suspected_lost']);
        DB::table('agent_sessions')->where('status', 'timed_out')->update(['status' => 'lost']);

        Schema::table('agent_sessions', function (Blueprint $table): void {
            $table->renameColumn('silent_since', 'suspected_lost_at');
            $table->renameColumn('end_evidence', 'loss_evidence');
        });
    }
};
