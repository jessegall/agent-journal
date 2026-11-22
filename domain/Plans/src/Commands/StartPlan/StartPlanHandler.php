<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\StartPlan;

use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Models\Plan;

/**
 * Starts the plan once, under its row lock, by the same rule the plans read offers. The plan raises PlanStarted only
 * when it changed, and PushPlanState puts its working frame on the starting agent's stack in the same transaction.
 */
final readonly class StartPlanHandler extends PlanCommandHandler
{
    public function handle(StartPlanCommand $command): void
    {
        $plan = Plan::query()->whereKey($command->planId)->lockForUpdate()->firstOr(
            fn () => throw PlanMissing::withId($command->planId),
        );

        $plan->startOnce($command->dispatchedBy());
    }
}
