<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\FinishPlan;

use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Exceptions\PlanHasUnfinishedTasks;
use Domain\Plans\Exceptions\PlanRevisionChanged;
use Domain\Tasks\Contracts\TaskProgressCounter;

final readonly class FinishPlanHandler extends PlanCommandHandler
{
    public function __construct(private TaskProgressCounter $progress) {}

    /**
     * @throws PlanRevisionChanged
     * @throws PlanHasUnfinishedTasks
     */
    public function handle(FinishPlanCommand $command): void
    {
        $plan = $this->lockPlanAtRevision($command->planId, $command->expectedRevision);

        if (! $plan->isStarted()) {
            throw PlanHasUnfinishedTasks::notStarted($plan->number, $plan->status->value);
        }

        $unfinished = $this->progress->progressOf($plan->taskIds())->unfinished();

        if ($unfinished > 0) {
            throw PlanHasUnfinishedTasks::for($plan->number, $unfinished);
        }

        $plan->finish($command->note, $command->dispatchedBy());
    }
}
