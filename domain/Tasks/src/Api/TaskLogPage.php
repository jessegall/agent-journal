<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

/**
 * One page of a task's log lines, oldest first, with the sequence to read before for older lines and after for newer
 * ones while they remain.
 */
final readonly class TaskLogPage
{
    /**
     * @param  list<TaskLogLine>  $lines
     */
    public function __construct(
        public array $lines,
        public int|null $olderBefore,
        public int|null $newerAfter,
    ) {}
}
