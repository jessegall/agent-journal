<?php

declare(strict_types=1);

namespace Domain\Tasks\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A task check got its result: the process run's receipt and outcome were bound to it. Raised only once the binding
 * has committed.
 */
final readonly class TaskCheckRecorded implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $taskId,
        public string $checkId,
    ) {}
}
