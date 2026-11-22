<?php

declare(strict_types=1);

namespace Domain\Tasks\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\CurrentActor;
use App\Contracts\Listener;
use App\Support\ActorIdentity;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
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

    public function handle(TaskStarted|TaskFinished|TaskBlocked|TaskCancelled $event): void
    {
        $task = Task::query()->whereKey($event->taskId)->sole();
        $actor = $event instanceof TaskStarted ? $event->actor : ActorIdentity::of($this->actors->actor());

        TaskHistoryEntry::create(
            $event->historyEntryId,
            $task,
            $task->run_number === 0 ? null : TaskRun::ofTask($task, $task->run_number),
            $actor,
            $event->previousState,
            $task->stateText,
        );
    }
}
