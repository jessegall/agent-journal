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

        $plan->cancel($command->reason, $command->dispatchedBy());
    }
}
