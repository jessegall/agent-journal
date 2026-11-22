<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\CancelPlan;

use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Exceptions\PlanRevisionChanged;

final readonly class CancelPlanHandler extends PlanCommandHandler
{
    /**
     * @throws PlanRevisionChanged
     */
    public function handle(CancelPlanCommand $command): void
    {
        $plan = $this->lockPlanAtRevision($command->planId, $command->expectedRevision);

        if ($command->expectedState !== null && $command->expectedState !== $plan->state) {
            throw PlanRevisionChanged::inState($plan->number, $plan->state->value);
        }

        $plan->cancel($command->reason, $command->dispatchedBy());
    }
}
