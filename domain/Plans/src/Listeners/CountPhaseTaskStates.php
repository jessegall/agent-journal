<?php

declare(strict_types=1);

namespace Domain\Plans\Listeners;

use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanProgressCount;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Events\TaskStarted;

/**
 * Moves the task tallies of the phase holding a task, and of its plan, from the state the task left to the one it
 * entered, inside the transaction that changed the task. It takes the plan's structure lock first, as placing tasks
 * does, so two changes in one plan count one after the other; a task in no phase counts nowhere.
 */
#[InCommandTransaction]
final readonly class CountPhaseTaskStates implements Listener
{
    public function handle(TaskStarted|TaskFinished|TaskBlocked|TaskCancelled $event): void
    {
        $enteredState = self::enteredStateOf($event);

        if ($event->previousState === $enteredState) {
            return;
        }

        $planId = Phase::query()->holdingTask($event->taskId)->value('plan_id');

        if ($planId === null) {
            return;
        }

        $plan = Plan::lockStructure((string) $planId);
        $phase = Phase::query()->holdingTask($event->taskId)->sole();

        $phase->recordProgress(PlanProgressCount::afterMove($phase->progress, $event->previousState, $enteredState));
        $plan->recordProgress(PlanProgressCount::afterMove($plan->progress, $event->previousState, $enteredState));
    }

    private static function enteredStateOf(TaskStarted|TaskFinished|TaskBlocked|TaskCancelled $event): TaskState
    {
        return match ($event::class) {
            TaskStarted::class => TaskState::Started,
            TaskFinished::class => TaskState::Finished,
            TaskBlocked::class => TaskState::Blocked,
            TaskCancelled::class => TaskState::Cancelled,
        };
    }
}
