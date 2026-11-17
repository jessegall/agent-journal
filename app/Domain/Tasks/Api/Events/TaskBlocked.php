<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Api\Events;

use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A task is blocked. Raised only once the change has committed.
 */
final readonly class TaskBlocked implements ShouldDispatchAfterCommit
{
    public function __construct(public int $taskId) {}
}
