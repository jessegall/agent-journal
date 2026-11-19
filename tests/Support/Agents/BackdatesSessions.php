<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Actors\Support\DatabaseClock;
use App\Agents\Support\LaunchedAgent;
use Illuminate\Support\Facades\DB;

/**
 * Moves a launched session's start into the past, as if it had been running for a while.
 */
trait BackdatesSessions
{
    private function startedSecondsAgo(LaunchedAgent $launched, int $seconds): void
    {
        DB::table('agent_sessions')->where('id', $launched->session->id)->update(
            ['created_at' => $this->app->make(DatabaseClock::class)->now()->subSeconds($seconds)],
        );
    }
}
