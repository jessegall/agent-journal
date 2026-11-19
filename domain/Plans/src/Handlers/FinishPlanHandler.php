<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Contracts\CommandHandler;
use Domain\Plans\Api\Events\PlanFinished;
use Domain\Plans\Commands\FinishPlan;
use Domain\Plans\Exceptions\PlanHasUnfinishedTasks;
use Domain\Plans\Exceptions\PlanRevisionChanged;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Contracts\TaskProgressCounter;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class FinishPlanHandler implements CommandHandler
{
    public function __construct(private TaskProgressCounter $progress, private Dispatcher $events) {}

    /**
     * @throws PlanRevisionChanged
     * @throws PlanHasUnfinishedTasks
     */
    public function handle(FinishPlan $command): void
    {
        $plan = Plan::lockStructure($command->planId);

        if ($plan->revision !== $command->expectedRevision) {
            throw PlanRevisionChanged::for($plan->number, $command->expectedRevision, $plan->revision);
        }

        if (! $plan->isStarted()) {
            throw PlanHasUnfinishedTasks::notStarted($plan->number, $plan->state->value);
        }

        $unfinished = $this->progress->progressOf($plan->taskIds())->unfinished();

        if ($unfinished > 0) {
            throw PlanHasUnfinishedTasks::for($plan->number, $unfinished);
        }

        $plan->finish($command->note);
        $this->events->dispatch(new PlanFinished($plan->id, $command->dispatchedBy()));
    }
}
