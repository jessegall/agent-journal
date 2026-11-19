<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Resolvers\AgentLabels;
use App\Agents\Support\AgentLabel;
use Illuminate\Container\Attributes\Bind;

/**
 * The display labels of agents for whoever acts in this request, read in one query. An id the actor may not see, or
 * that does not exist, is left out, never given a made-up label.
 */
#[Bind(AgentLabels::class)]
interface AgentResolver
{
    /**
     * @param  list<string>  $agentIds
     * @return array<string, AgentLabel> keyed by agent id
     */
    public function labelsFor(array $agentIds): array;
}
