<?php

declare(strict_types=1);

namespace App\Domain\Plans\Listeners;

use App\Domain\Plans\Events\PlanProgressChanged;
use App\Domain\Plans\Models\Phase;
use App\Domain\Tasks\Events\TaskBlocked;
use App\Domain\Tasks\Events\TaskCancelled;
use App\Domain\Tasks\Events\TaskFinished;
use App\Domain\Tasks\Events\TaskStarted;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Hears the Tasks facts and tells that the progress of the plan holding that task moved; a task sits in one phase at
 * most, so one plan at most hears of it.
 */
final readonly class RaisePlanProgressChanged
{
    public function __construct(private Dispatcher $events) {}

    public function handle(TaskStarted|TaskFinished|TaskBlocked|TaskCancelled $event): void
    {
        $phase = Phase::query()->holdingTask($event->taskId)->first();

        if ($phase === null) {
            return;
        }

        $this->events->dispatch(new PlanProgressChanged($phase->plan_id));
    }
}
