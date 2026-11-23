<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

/**
 * The two tasks of one wait: the task that waits and the task it waits on.
 */
final readonly class TaskWaitPair
{
    public function __construct(
        public string $dependentTaskId,
        public string $prerequisiteTaskId,
    ) {}
}
