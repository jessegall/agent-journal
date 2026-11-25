<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Contracts\Navigation\ClientUpdate;
use App\Support\Sources\Contracts\DockSourceChanged;
use Domain\Tasks\Contracts\TaskRunEndEvent;
use Domain\Tasks\Contracts\TaskWaitEvent;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;

/**
 * A task is blocked. Raised only once the change has committed; it names the state the task left, so a
 * tally of task states moves by one, and the id of its entry in the task's history, so a reader takes it once. Plans keeps its phase tallies in the same transaction.
 */
final readonly class TaskBlocked implements ClientUpdate, DockSourceChanged, TaskEvent, TaskRunEndEvent, TaskWaitEvent
{
    public function __construct(
        public string $taskId,
        public TaskStatus $previousState,
        public string $historyEntryId,
    ) {}

    public function dockType(): string
    {
        return Task::linkType();
    }

    public function dockId(): string
    {
        return $this->taskId;
    }

    public function enteredState(): TaskStatus
    {
        return TaskStatus::Blocked;
    }
}
