<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\CurrentAuthorizer;
use App\Enums\Agents\AccessType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Sessions\CapacityResource;
use App\Models\Agents\Agent;
use App\Models\Sessions\CapacityReservation;
use App\Policies\AgentPolicy;
use App\Values\ExecutionBudgets;
use App\Values\HostCapacity;

/**
 * Whether a start with these choices would fit the host now, for whoever may start the agent: only a required
 * container start is admitted against the host's capacity, as at admission. It reserves nothing and starts nothing;
 * admission checks again under its lock when the start is submitted.
 */
final readonly class CapacityCheck
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private HostCapacity $capacity,
    ) {}

    /**
     * The resource the start would not fit in, none when it fits.
     */
    public function shortageFor(Agent $agent, ExecutionModeType $mode, ExecutionBudgets $budgets): CapacityResource|null
    {
        $this->authorizer->authorize(AgentPolicy::class, $agent, AccessType::Create);

        if ($mode !== ExecutionModeType::RequiredContainer) {
            return null;
        }

        return CapacityReservation::shortageOf($budgets, $this->capacity);
    }
}
