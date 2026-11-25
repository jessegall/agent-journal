<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;

/**
 * The driver each agent among some actors runs now, so a roster or a candidate list names it beside the agent.
 */
final readonly class AgentDrivers
{
    /**
     * @param  list<ActorIdentity>  $actors
     * @return array<string, string> the driver of each running agent, keyed by its actor key
     */
    public function driversOf(array $actors): array
    {
        $agentIds = array_values(array_map(
            fn (ActorIdentity $actor) => $actor->id,
            array_filter($actors, fn (ActorIdentity $actor) => $actor->isAgent()),
        ));

        $drivers = [];

        foreach (AgentSession::runningDriversOf($agentIds) as $agentId => $driver) {
            $drivers[Agent::storedType().':'.$agentId] = $driver;
        }

        return $drivers;
    }
}
