<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Navigation\Contracts\ClientUpdate;
use App\Records\Contracts\RecordChanged;
use Domain\Tasks\Contracts\TaskRunEndEvent;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;

/**
 * A task was cancelled. Raised only once the change has committed; it names the state the task left, so a
 * tally of task states moves by one, and the id of its entry in the task's history, so a reader takes it once. Plans keeps its phase tallies in the same transaction.
 */
final readonly class TaskCancelled implements ClientUpdate, RecordChanged, TaskEvent, TaskRunEndEvent
{
    public function __construct(
        public string $taskId,
        public TaskStatus $previousState,
        public string $historyEntryId,
    ) {}

    public function recordType(): string
    {
        return Task::linkType();
    }

    public function recordId(): string
    {
        return $this->taskId;
    }

    public function enteredState(): TaskStatus
    {
        return TaskStatus::Cancelled;
    }
}
