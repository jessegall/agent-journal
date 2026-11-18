<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use Domain\Tasks\Enums\TaskWorkState;

/**
 * A fresh snapshot of one run of a task, read for one hook and never kept across hooks.
 */
final readonly class TaskWork
{
    public function __construct(
        public string $taskId,
        public int $runNumber,
        public TaskWorkState $state,
    ) {}

    public function needsWork(): bool
    {
        return $this->state->needsWork();
    }

    public function unfinishedReason(): string
    {
        return "Task {$this->taskId} still needs work: finish it or record why it is blocked.";
    }
}
