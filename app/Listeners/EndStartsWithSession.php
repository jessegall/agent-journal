<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Sessions\AgentSessionEnded;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;

/** Releases each unresolved start's account use when its session ends. */
#[InCommandTransaction]
final readonly class EndStartsWithSession implements Listener
{
    public function handle(AgentSessionEnded $fact): void
    {
        $session = AgentSession::query()->whereKey($fact->sessionId)->sole();

        if ($session->ended_at === null) {
            return;
        }

        foreach (SessionProcess::findUnresolvedOfSession($fact->sessionId) as $start) {
            $start->endWithSession($session->ended_at);
        }
    }
}
