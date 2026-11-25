<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Sessions\StartReservations;
use App\Exceptions\AgentNotAvailable;
use App\Models\Agents\Agent;

/**
 * Takes the same lifecycle lock and start reservation every start takes, so an owner can recheck its work facts
 * under it before it runs the start.
 */
final readonly class ReserveStarts implements StartReservations
{
    public function __construct(private AgentSessions $sessions) {}

    public function reserve(ActorIdentity $agent): void
    {
        $found = Agent::withId($agent->id)->getOrThrow(AgentNotAvailable::forAgent($agent->id));
        $this->sessions->reserveStart($found);
    }

    public function hasRetired(ActorIdentity $agent): bool
    {
        return Agent::withId($agent->id)->map(fn (Agent $found) => $found->isRetired())->getOrElse(true);
    }
}
