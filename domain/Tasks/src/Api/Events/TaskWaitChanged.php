<?php

declare(strict_types=1);

namespace Domain\Tasks\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Domain\Tasks\Enums\TaskWaitChange;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A wait between two tasks was added, removed or waived, so both tasks' readers and their readiness read again.
 * Raised only once the change has committed.
 */
final readonly class TaskWaitChanged implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $waitId,
        public string $dependentTaskId,
        public string $prerequisiteTaskId,
        public TaskWaitChange $change,
    ) {}
}
