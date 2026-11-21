<?php

declare(strict_types=1);

namespace Domain\Plans\Listeners;

use App\Contracts\Listener;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Domain\Plans\Models\Phase;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Receives the committed Tasks facts that end a run and tells that the progress of the plan holding that task moved; a
 * task sits in one phase at most, so one plan at most is told. A start is sampled by SamplePlanOfStartedTask.
 */
final readonly class RaisePlanProgressChanged implements Listener
{
    public function __construct(private Dispatcher $events) {}

    public function handle(TaskFinished|TaskBlocked|TaskCancelled $event): void
    {
        $phase = Phase::query()->holdingTask($event->taskId)->first();

        if ($phase === null) {
            return;
        }

        $this->events->dispatch(new PlanProgressChanged($phase->plan_id));
    }
}
