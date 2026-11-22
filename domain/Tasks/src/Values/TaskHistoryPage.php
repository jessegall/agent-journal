<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

/**
 * One page of a task's history, newest first, and the sequence to read before for the next page while older entries
 * remain.
 */
final readonly class TaskHistoryPage
{
    /**
     * @param  list<TaskTransition>  $entries
     */
    public function __construct(
        public array $entries,
        public int|null $nextBefore,
    ) {}
}
