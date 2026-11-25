<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\Sources\Contracts\DockSourceChanged;
use Domain\Tasks\Contracts\TaskRunEndEvent;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;

/**
 * A task was cancelled. Raised only once the change has committed; it names the state the task left, so a
 * tally of task states moves by one, and the id of its entry in the task's history, so a reader takes it once. Plans keeps its phase tallies in the same transaction.
 */
final readonly class TaskCancelled extends TaskEvent implements DockSourceChanged, TaskRunEndEvent, UserInterfaceUpdater
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
        return TaskStatus::Cancelled;
    }
}
