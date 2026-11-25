<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\EditPlan;

use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Exceptions\PlanRevisionChanged;
use Domain\Plans\Support\PlanApprovals;

final readonly class EditPlanHandler extends PlanCommandHandler
{
    public function __construct(private PlanApprovals $approvals) {}

    /**
     * Gives the plan its new text as a new revision; an approval of the earlier content stays recorded but becomes
     * historical.
     *
     * @throws PlanRevisionChanged
     */
    public function handle(EditPlanCommand $command): int
    {
        $plan = $this->lockPlanAtRevision($command->planId, $command->expectedRevision);

        $plan->describe(
            $command->title ?? $plan->title,
            $command->brief ?? $plan->brief,
            $command->type ?? $plan->type,
        );

        $this->approvals->retireCurrentOf($plan);

        return $plan->revision;
    }
}
