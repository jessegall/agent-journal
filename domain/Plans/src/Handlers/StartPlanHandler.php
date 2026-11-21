<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Hooks\Contracts\ActorWorkStacks;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Handlers\Support\PlanCommandHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\States\Support\WorkingOnPlanStateReference;

/**
 * Starts the plan once, under its row lock, by the same rule the plans read offers. An agent that starts it gets the
 * plan's working frame on its stack in the same transaction, so its current plan is read from the stack; a user's start
 * changes no stack. The plan raises PlanStarted only when it changed.
 */
final readonly class StartPlanHandler extends PlanCommandHandler
{
    public function __construct(
        private ActorWorkStacks $workStacks,
    ) {}

    public function handle(StartPlan $command): void
    {
        $plan = Plan::query()->whereKey($command->planId)->lockForUpdate()->firstOr(
            fn () => throw PlanMissing::withId($command->planId),
        );

        if (! $plan->startOnce($command->dispatchedBy())) {
            return;
        }

        $this->workStacks->push(WorkingOnPlanStateReference::forPlan($plan));
    }
}
