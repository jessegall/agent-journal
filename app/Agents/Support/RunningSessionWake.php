<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\ActorWake;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;

/**
 * Wakes the runtime of the actor's newest running session; an actor with no running session has no runtime to wake.
 */
final readonly class RunningSessionWake implements ActorWake
{
    public function __construct(private DriverRequests $requests) {}

    public function wake(ActorIdentity $actor, string $idempotencyKey): DriverReceipt|null
    {
        $session = AgentSession::query()
            ->runningFor($actor->id)
            ->whereIn('id', AgentRuntime::query()->select('agent_session_id'))
            ->latest()
            ->first();

        if ($session === null) {
            return null;
        }

        return $this->requests->wake(new StackTarget($actor->id, $session->id), $idempotencyKey);
    }
}
