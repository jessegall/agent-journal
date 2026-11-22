<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use Domain\Plans\Commands\CancelPlan;
use Domain\Plans\Exceptions\PlanRevisionChanged;
use Domain\Plans\Handlers\Support\PlanCommandHandler;

final readonly class CancelPlanHandler extends PlanCommandHandler
{
    /**
     * @throws PlanRevisionChanged
     */
    public function handle(CancelPlan $command): void
    {
        $plan = $this->lockPlanAtRevision($command->planId, $command->expectedRevision);

        if ($command->expectedState !== null && $command->expectedState !== $plan->state) {
            throw PlanRevisionChanged::inState($plan->number, $plan->state->value);
        }

        $plan->cancel($command->reason, $command->dispatchedBy());
    }
}
