<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Contracts\Event;
use App\Contracts\UserInterfaceUpdater;

/**
 * A task check got its result: the process run's receipt and outcome were bound to it. Raised only once the binding
 * has committed.
 */
final readonly class TaskCheckRecorded implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $taskId,
        public string $checkId,
    ) {}
}
