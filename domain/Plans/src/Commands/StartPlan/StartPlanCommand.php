<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\StartPlan;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
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
