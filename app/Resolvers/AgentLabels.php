<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Actors\Contracts\ActorLabelProvider;
use App\Actors\Contracts\CurrentActor;
use App\Agents\AgentInspection;
use App\Agents\AgentLabel;
use App\Models\Agents\Agent;
use App\Sessions\Contracts\AgentResolver;

/**
 * Reads agent labels for the actor of this request: the user sees every agent, an agent only itself. Without an actor
 * it refuses before reading anything.
 */
final readonly class AgentLabels implements ActorLabelProvider, AgentResolver
{
    public function __construct(private CurrentActor $actors, private AgentInspection $inspection) {}

    /**
     * @param  list<string>  $ids
     * @return array<string, AgentLabel>
     */
    public function labelsFor(array $ids): array
    {
        $actor = $this->actors->actor();
        $unique = array_values(array_unique($ids));
        $visible = $this->inspection->seesEveryAgent() ? $unique : array_values(array_intersect($unique, [$actor->id]));

        if ($visible === []) {
            return [];
        }

        return Agent::query()->whereKey($visible)->readExactly(count($visible))->get()
            ->mapWithKeys(fn (Agent $agent) => [$agent->id => new AgentLabel($agent->id, $agent->name)])
            ->all();
    }

    /**
     * @param  list<string>  $actorIds
     * @return array<string, string>
     */
    public function namesOf(array $actorIds): array
    {
        return array_map(fn (AgentLabel $label) => $label->name, $this->labelsFor($actorIds));
    }
}
