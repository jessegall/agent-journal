<?php

declare(strict_types=1);

namespace App\Core\Agents\Contracts;

use App\Core\Agents\Readers\AgentLabels;
use App\Core\Agents\Support\AgentLabel;
use Illuminate\Container\Attributes\Bind;

/**
 * The display labels of agents for whoever acts in this request, read in one query. An id the actor may not see, or
 * that does not exist, is left out, never given a made-up label.
 */
#[Bind(AgentLabels::class)]
interface AgentReader
{
    /**
     * @param  list<int>  $agentIds
     * @return array<int, AgentLabel> keyed by agent id
     */
    public function labelsFor(array $agentIds): array;
}
