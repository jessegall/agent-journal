<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Handlers\StartPlanHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Starts a plan for the actor of this request, a user or an agent alike; starting a started plan changes nothing.
 *
 * @extends Command<null>
 */
#[HandledBy(StartPlanHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
#[Operation('start_plan', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class StartPlan extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $planId,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Plan::class;
    }
}
