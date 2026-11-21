<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\RuntimeStops;
use App\Agents\Models\AgentSession;
use App\Agents\Values\StackTarget;

/**
 * Sends a stop request to each running session of the agent; a session already stopped needs none.
 */
final readonly class DriverRuntimeStops implements RuntimeStops
{
    public function __construct(private DriverRequests $requests) {}

    public function stopAgent(ActorIdentity $agent, string $idempotencyKey): void
    {
        $sessions = AgentSession::query()
            ->runningFor($agent->id)
            ->readAll('the running sessions of one agent, at most a few')
            ->get();

        foreach ($sessions as $session) {
            $this->requests->stop(new StackTarget($agent->id, $session->id), "{$idempotencyKey}:{$session->id}");
        }
    }
}
