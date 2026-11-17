<?php

declare(strict_types=1);

namespace App\Core\Agents\Readers;

use App\Core\Agents\Contracts\AgentReader;
use App\Core\Agents\Models\Agent;
use App\Core\Agents\Support\AgentLabel;
use App\Core\Contracts\CurrentActor;

/**
 * Reads agent labels for the actor of this request: the user sees every agent, an agent only itself. Without an actor
 * it refuses before reading anything.
 */
final readonly class AgentLabels implements AgentReader
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @param  list<int>  $agentIds
     * @return array<int, AgentLabel>
     */
    public function labelsFor(array $agentIds): array
    {
        $actor = $this->actors->actor();
        $visible = $actor->isUser() ? array_values(array_unique($agentIds)) : array_values(array_intersect(array_unique($agentIds), [$actor->id]));

        if ($visible === []) {
            return [];
        }

        return Agent::query()->whereKey($visible)->get()
            ->mapWithKeys(fn (Agent $agent) => [$agent->id => new AgentLabel($agent->id, $agent->name)])
            ->all();
    }
}
