<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\AgentLabel;

/**
 * The display labels of agents for whoever acts in this request, read in one query. An id the actor may not see, or
 * that does not exist, is left out, never given a made-up label.
 */
interface AgentResolver
{
    /**
     * @param  list<string>  $agentIds
     * @return array<string, AgentLabel> keyed by agent id
     */
    public function labelsFor(array $agentIds): array;
}
