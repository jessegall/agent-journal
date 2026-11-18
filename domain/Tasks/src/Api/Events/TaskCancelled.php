<?php

declare(strict_types=1);

namespace Domain\Tasks\Api\Events;

use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A task was cancelled. Raised only once the change has committed.
 */
final readonly class TaskCancelled implements ShouldDispatchAfterCommit
{
    public function __construct(public int $taskId) {}
}
