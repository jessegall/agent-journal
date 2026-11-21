<?php

declare(strict_types=1);

namespace Tests\Fixtures\Tasks;

use Domain\Tasks\Events\TaskStarted;
use RuntimeException;

/**
 * A required listener that fails after the started task was pushed, so the start must roll back with its stack.
 */
final readonly class FailsAfterPush
{
    public function handle(TaskStarted $started): void
    {
        throw new RuntimeException("The work after pushing {$started->taskId} failed.");
    }
}
