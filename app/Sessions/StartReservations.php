<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Models\Agents\Agent;
use App\Sessions\Exceptions\AgentNotAvailable;
use App\Support\ActorReference;

/**
 * Takes the same lifecycle lock and start reservation every start takes, so an owner can recheck its work facts
 * under it before it runs the start.
 */
final readonly class StartReservations
{
    public function __construct(private AgentSessions $sessions) {}

    public function reserve(ActorReference $agent): void
    {
        $found = Agent::findWithId($agent->id)->getOrThrow(AgentNotAvailable::forAgent($agent->id));
        $this->sessions->reserveStart($found);
    }

    public function hasRetired(ActorReference $agent): bool
    {
        return Agent::findWithId($agent->id)->map(fn (Agent $found) => $found->isRetired())->getOrElse(true);
    }
}
