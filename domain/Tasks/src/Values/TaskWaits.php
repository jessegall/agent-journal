<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

/**
 * A task's direct waits both ways: the tasks it waits for, and the tasks it holds up.
 */
final readonly class TaskWaits
{
    /**
     * @param  list<TaskWaitLink>  $waitsFor
     * @param  list<TaskWaitLink>  $holdsUp
     */
    public function __construct(
        public array $waitsFor,
        public array $holdsUp,
    ) {}
}
