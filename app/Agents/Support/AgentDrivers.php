<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Models\AgentSession;

/**
 * The driver each agent among some actors runs now, so a roster or a candidate list names it beside the agent.
 */
final readonly class AgentDrivers
{
    /**
     * @param  list<ActorIdentity>  $actors
     * @return array<string, string>  the driver of each running agent, keyed by its actor key
     */
    public function driversOf(array $actors): array
    {
        $agentIds = array_values(array_map(
            fn (ActorIdentity $actor) => $actor->id,
            array_filter($actors, fn (ActorIdentity $actor) => $actor->type === ActorType::Agent),
        ));
        $drivers = [];

        foreach (AgentSession::runningDriversOf($agentIds) as $agentId => $driver) {
            $drivers[ActorType::Agent->value.':'.$agentId] = $driver;
        }

        return $drivers;
    }
}
