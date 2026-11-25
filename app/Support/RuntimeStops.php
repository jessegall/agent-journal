<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Processes\RuntimeStops as RuntimeStopsContract;
use App\Models\Agents\AgentSession;
use App\Values\StackTarget;

/**
 * Sends a stop request to each running session of the agent; a session already stopped needs none.
 */
final readonly class RuntimeStops implements RuntimeStopsContract
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
