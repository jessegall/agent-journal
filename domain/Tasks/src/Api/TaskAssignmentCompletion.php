<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

/**
 * How many tasks a group holds and how many of them are not over yet, for deciding whether the group's work is done.
 */
final readonly class TaskAssignmentCompletion
{
    public function __construct(
        public int $taskCount,
        public int $unfinishedCount,
    ) {}

    /**
     * A group with no tasks is not finished; one whose every task ended, finished or cancelled, is.
     */
    public function isFinished(): bool
    {
        return $this->taskCount > 0 && $this->unfinishedCount === 0;
    }
}
