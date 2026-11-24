<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * A task check got its result: the process run's receipt and outcome were bound to it. Raised only once the binding
 * has committed.
 */
final readonly class TaskCheckRecorded extends TaskEvent implements UserInterfaceUpdater
{
    public function __construct(
        public string $taskId,
        public string $checkId,
    ) {}
}
