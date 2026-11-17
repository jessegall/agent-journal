<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Support;

use App\Domain\Tasks\Enums\TaskWorkState;

/**
 * A fresh snapshot of one run of a task, read for one hook and never kept across hooks.
 */
final readonly class TaskWork
{
    public function __construct(
        public int $number,
        public int $runNumber,
        public TaskWorkState $state,
    ) {}

    public function needsWork(): bool
    {
        return $this->state->needsWork();
    }

    public function unfinishedReason(): string
    {
        return "Task {$this->number} still needs work: finish it or record why it is blocked.";
    }
}
