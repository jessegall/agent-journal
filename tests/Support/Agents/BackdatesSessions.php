<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Sessions\StartedAgent;
use App\Support\ServerClock;
use Illuminate\Support\Facades\DB;

/**
 * Moves a started session's start into the past, as if it had been running for a while.
 */
trait BackdatesSessions
{
    private function startedSecondsAgo(StartedAgent $started, int $seconds): void
    {
        DB::table('agent_sessions')->where('id', $started->session->id)->update(
            ['created_at' => $this->app->make(ServerClock::class)->now()->subSeconds($seconds)],
        );
    }
}
