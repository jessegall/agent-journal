<?php

declare(strict_types=1);

namespace Domain\Plans\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanProgressCount;
use Domain\Tasks\Contracts\TaskStateEvent;

/**
 * Moves the task tallies of the phase holding a task, and of its plan, from the state the task left to the one it
 * entered, inside the transaction that changed the task. It takes the plan's structure lock first, as placing tasks
 * does, so two changes in one plan count one after the other; a task in no phase counts nowhere.
 */
#[InCommandTransaction]
final readonly class CountPhaseTaskStates implements Listener
{
    public function handle(TaskStateEvent $event): void
    {
        $enteredState = $event->enteredState();

        if ($event->previousState === $enteredState) {
            return;
        }

        $planId = Phase::query()->holdingTask($event->taskId)->value('plan_id');

        if ($planId === null) {
            return;
        }

        $plan = Plan::findLockedStructure((string) $planId);
        $phase = Phase::query()->holdingTask($event->taskId)->sole();

        $phase->recordProgress(PlanProgressCount::afterMove($phase->progress, $event->previousState, $enteredState));
        $plan->recordProgress(PlanProgressCount::afterMove($plan->progress, $event->previousState, $enteredState));
    }
}
