<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Sessions\StartReservations;
use App\Exceptions\AgentNotAvailable;
use App\Exceptions\AgentReservedForReview;
use App\Models\Agent;
use App\Models\WorkReservation;

/**
 * Takes the same lifecycle lock and start reservation every start takes, so an owner can recheck its work facts
 * under it before it runs the start. An agent whose certified work is held for review is refused under that lock, so
 * a candidate picked before the reservation cannot take it.
 */
final readonly class ReserveStarts implements StartReservations
{
    public function __construct(private AgentSessions $sessions) {}

    public function reserve(ActorIdentity $agent): void
    {
        $found = Agent::withId($agent->id)->getOrThrow(AgentNotAvailable::forAgent($agent->id));
        $this->sessions->reserveStart($found);

        if (WorkReservation::holds($agent)) {
            throw AgentReservedForReview::forAgent($agent->id);
        }
    }

    public function hasRetired(ActorIdentity $agent): bool
    {
        return Agent::withId($agent->id)->map(fn (Agent $found) => $found->isRetired())->getOrElse(true);
    }
}
