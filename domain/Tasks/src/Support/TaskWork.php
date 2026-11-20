<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use Domain\Tasks\Enums\TaskState;

/**
 * A fresh snapshot of one run of a task, read for one hook and never kept across hooks.
 */
final readonly class TaskWork
{
    public function __construct(
        public int $number,
        public int $runNumber,
        public TaskState $state,
        public bool $isCurrentRun = true,
    ) {}

    /**
     * Whether this run is the task's current one and still started; a finished, blocked, cancelled or released run,
     * or an earlier run, needs no more work.
     */
    public function needsWork(): bool
    {
        return $this->isCurrentRun && $this->state === TaskState::Started;
    }

    public function unfinishedReason(): string
    {
        return "Task {$this->number} still needs work: finish it or record why it is blocked.";
    }
}
