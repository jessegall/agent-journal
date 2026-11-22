<?php

declare(strict_types=1);

namespace Domain\Plans\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Events\Listener;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Models\Phase;
use Domain\Tasks\Events\TaskStarted;

/**
 * Reads the plan holding a started task inside the start's transaction and stages that plan's progress for release
 * after the commit, so a later reassignment of the task cannot retarget it; a task in no phase stages nothing.
 */
#[InCommandTransaction]
final readonly class SamplePlanOfStartedTask implements Listener
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(TaskStarted $event): void
    {
        $phase = Phase::query()->holdingTask($event->taskId)->first();

        if ($phase === null) {
            return;
        }

        $this->facts->publishAfterCommit(new PlanProgressChanged($phase->plan_id));
    }
}
