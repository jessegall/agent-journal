<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\StartPlan;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Starts a plan for the actor of this request, a user or an agent alike; starting a started plan changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(PlanPolicy::class, AccessType::Create)]
final readonly class StartPlanCommand extends Command
{
    public function __construct(
        public string $planId,
    ) {}
}
