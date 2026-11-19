<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Handlers\CancelPlanHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Cancels a plan with its reason; its tasks and assignments stay.
 *
 * @extends Command<null>
 */
#[HandledBy(CancelPlanHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
final readonly class CancelPlan extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $planId,
        public int $expectedRevision,
        public string $reason,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Plan::class;
    }
}
