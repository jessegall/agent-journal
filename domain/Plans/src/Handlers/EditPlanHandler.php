<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use Domain\Plans\Commands\EditPlan;
use Domain\Plans\Exceptions\PlanRevisionChanged;
use Domain\Plans\Handlers\Support\PlanCommandHandler;

final readonly class EditPlanHandler extends PlanCommandHandler
{
    /**
     * @throws PlanRevisionChanged
     */
    public function handle(EditPlan $command): int
    {
        $plan = $this->lockPlanAtRevision($command->planId, $command->expectedRevision);

        $plan->describe(
            $command->title ?? $plan->title,
            $command->brief ?? $plan->brief,
            $command->type ?? $plan->type,
        );

        return $plan->revision;
    }
}
