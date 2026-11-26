<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Navigation\Contracts\ClientUpdate;

/**
 * A task check got its result: the process run's receipt and outcome were bound to it. Raised only once the binding
 * has committed.
 */
final readonly class TaskCheckRecorded implements ClientUpdate, TaskEvent
{
    public function __construct(
        public string $taskId,
        public string $checkId,
    ) {}
}
