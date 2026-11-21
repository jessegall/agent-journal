<?php

declare(strict_types=1);

namespace Domain\Tasks\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A line was added to a task run's log. Raised only once the change has committed; it names the entry so a reader
 * takes it once.
 */
final readonly class TaskLogged implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $taskId,
        public string $entryId,
    ) {}
}
