<?php

declare(strict_types=1);

namespace Domain\Tasks\Api\Events;

use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A task finished. Raised only once the change has committed.
 */
final readonly class TaskFinished implements Event, ShouldDispatchAfterCommit
{
    public function __construct(public string $taskId) {}
}
