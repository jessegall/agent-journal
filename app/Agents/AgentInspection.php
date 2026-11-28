<?php

declare(strict_types=1);

namespace App\Agents;

use App\Access\Contracts\CurrentAuthorizer;
use App\Agents\Enums\AccessType;
use App\Models\Agents\Agent;
use App\Policies\AgentMaintenancePolicy;
use App\Support\ActorReference;
use Illuminate\Database\Eloquent\Builder;

/**
 * Whether the caller may read every agent's sessions, runtimes and publications, not only its own: the read access
 * of the agent maintenance policy, asked in one place.
 */
final readonly class AgentInspection
{
    public function __construct(private CurrentAuthorizer $authorizer) {}

    public function seesEveryAgent(): bool
    {
        return $this->authorizer->filterActions(AgentMaintenancePolicy::class, Agent::class, [AccessType::Read]) !== [];
    }

    /**
     * The agents the actor may see, as a query its reader orders and bounds: every one for whoever sees every agent,
     * only itself otherwise.
     *
     * @return Builder<Agent>
     */
    public function agentsSeenBy(ActorReference $actor): Builder
    {
        if ($this->seesEveryAgent()) {
            return Agent::query();
        }

        return Agent::query()->whereKey($actor->id);
    }
}
