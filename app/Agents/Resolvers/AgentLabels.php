<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\ActorLabelProvider;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Agents\Contracts\AgentResolver;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Support\AgentLabel;
use App\Operations\Enums\AccessType;

/**
 * Reads agent labels for the actor of this request: the user sees every agent, an agent only itself. Without an actor
 * it refuses before reading anything.
 */
final readonly class AgentLabels implements ActorLabelProvider, AgentResolver
{
    public function __construct(private CurrentActor $actors, private CurrentAuthorizer $authorizer) {}

    /**
     * @param  list<string>  $ids
     * @return array<string, AgentLabel>
     */
    public function labelsFor(array $ids): array
    {
        $actor = $this->actors->actor();
        $unique = array_values(array_unique($ids));
        $visible = $this->inspectsAgents() ? $unique : array_values(array_intersect($unique, [$actor->id]));

        if ($visible === []) {
            return [];
        }

        return Agent::query()->whereKey($visible)->readLimit(count($visible))->get()
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

    /**
     * Whether the caller may see every agent's sessions and runtimes, not only its own.
     */
    private function inspectsAgents(): bool
    {
        return $this->authorizer->filterActions(AgentMaintenancePolicy::class, Agent::class, [AccessType::Read]) !== [];
    }
}
