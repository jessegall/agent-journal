<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Operations\Enums\AccessType;

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
}
