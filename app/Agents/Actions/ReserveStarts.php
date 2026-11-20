<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\StartReservations;
use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Models\Agent;

/**
 * Takes the same lifecycle lock and start reservation every start takes, so an owner can recheck its work facts
 * under it before it runs the start.
 */
final readonly class ReserveStarts implements StartReservations
{
    public function __construct(private AgentSessions $sessions) {}

    public function reserve(ActorIdentity $agent): void
    {
        $found = Agent::query()->whereKey($agent->id)->first();

        if ($found === null) {
            throw AgentNotAvailable::forAgent($agent->id);
        }

        $this->sessions->reserveStart($found);
    }
}
