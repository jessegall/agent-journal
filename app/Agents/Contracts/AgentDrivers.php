<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Support\ActorReference;

/**
 * The driver each agent among some actors runs now, so a roster or a candidate list names it beside the agent.
 */
interface AgentDrivers
{
    /**
     * The driver each running agent among the actors runs now.
     *
     * @param  list<ActorReference>  $actors
     * @return array<string, string> the driver of each running agent, keyed by its actor key
     */
    public function driversOf(array $actors): array;
}
