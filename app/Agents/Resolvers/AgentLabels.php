<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\AgentResolver;
use App\Agents\Models\Agent;
use App\Agents\Support\AgentLabel;

/**
 * Reads agent labels for the actor of this request: the user sees every agent, an agent only itself. Without an actor
 * it refuses before reading anything.
 */
final readonly class AgentLabels implements AgentResolver
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @param  list<string>  $agentIds
     * @return array<string, AgentLabel>
     */
    public function labelsFor(array $agentIds): array
    {
        $actor = $this->actors->actor();
        $visible = $actor->isUser() ? array_values(array_unique($agentIds)) : array_values(array_intersect(array_unique($agentIds), [$actor->id]));

        if ($visible === []) {
            return [];
        }

        return Agent::query()->whereKey($visible)->readLimit(count($visible))->get()
            ->mapWithKeys(fn (Agent $agent) => [$agent->id => new AgentLabel($agent->id, $agent->name)])
            ->all();
    }
}
