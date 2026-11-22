<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\CurrentAuthorizer;
use App\Enums\AccessType;
use App\Models\Agent;
use App\Policies\AgentMaintenancePolicy;

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
