<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Contracts\AgentDrivers as AgentDriversContract;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Support\ActorReference;

/**
 * The driver each agent among some actors runs now, so a roster or a candidate list names it beside the agent.
 */
final readonly class AgentDrivers implements AgentDriversContract
{
    /**
     * @param  list<ActorReference>  $actors
     * @return array<string, string> the driver of each running agent, keyed by its actor key
     */
    public function driversOf(array $actors): array
    {
        $agentIds = array_values(array_map(
            fn (ActorReference $actor) => $actor->id,
            array_filter($actors, fn (ActorReference $actor) => $actor->isAgent()),
        ));

        $drivers = [];

        foreach (AgentSession::resolveRunningDriversOf($agentIds) as $agentId => $driver) {
            $drivers[Agent::storedType().':'.$agentId] = $driver;
        }

        return $drivers;
    }
}
