<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;
use Domain\Tasks\Contracts\TaskWaitEvent;
use Domain\Tasks\Enums\TaskWaitChange;

/**
 * A wait between two tasks was added, removed or waived, so both tasks' readers and their readiness read again.
 * Raised only once the change has committed.
 */
final readonly class TaskWaitChanged extends TaskEvent implements TaskWaitEvent, UserInterfaceUpdater
{
    public function __construct(
        public string $waitId,
        public string $dependentTaskId,
        public string $prerequisiteTaskId,
        public TaskWaitChange $change,
    ) {}
}
