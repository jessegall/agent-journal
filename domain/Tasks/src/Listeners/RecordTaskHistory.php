<?php

declare(strict_types=1);

namespace Domain\Tasks\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Events\Listener;
use App\Support\ActorReference;
use Domain\Tasks\Contracts\TaskStateEvent;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskHistoryEntry;
use Domain\Tasks\Models\TaskRun;

/**
 * Appends each committed task change to the task's history in the change's own transaction, under the id its fact
 * names: the run it belongs to, the actor, the state left and entered, and the exact note or reason as the task row
 * holds it now, so a later run's change never rewrites it.
 */
#[InCommandTransaction]
final readonly class RecordTaskHistory implements Listener
{
    public function __construct(private CurrentActor $actors) {}

    public function handle(TaskStateEvent $event): void
    {
        $task = Task::query()->whereKey($event->taskId)->sole();
        $actor = $event instanceof TaskStarted ? $event->actor : ActorReference::of($this->actors->actor());

        TaskHistoryEntry::create(
            $event->historyEntryId,
            $task,
            $task->run_number === 0 ? null : TaskRun::findForTask($task, $task->run_number),
            $actor,
            $event->previousState,
            $task->stateText,
        );
    }
}
