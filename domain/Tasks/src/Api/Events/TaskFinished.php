<?php

declare(strict_types=1);

namespace Domain\Tasks\Api\Events;

use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A task finished. Raised only once the change has committed.
 */
final readonly class TaskFinished implements ShouldDispatchAfterCommit
{
    public function __construct(public int $taskId) {}
}
