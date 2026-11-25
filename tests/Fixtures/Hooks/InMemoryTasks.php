<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use Domain\Tasks\Enums\TaskStatus;

/**
 * The tasks a hook test pretends exist, each number with its current state, which a test changes in place.
 */
final class InMemoryTasks
{
    /**
     * @param  array<int, TaskStatus>  $tasks
     */
    public function __construct(public array $tasks = []) {}

    public function isStarted(int $number): bool
    {
        return ($this->tasks[$number] ?? null) === TaskStatus::Started;
    }
}
