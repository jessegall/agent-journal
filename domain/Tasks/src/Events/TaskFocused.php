<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * An agent put one of its started tasks in focus: the task it works on now. Raised only once the change committed.
 */
final readonly class TaskFocused extends TaskEvent implements UserInterfaceUpdater
{
    public function __construct(
        public string $taskId,
        public string $agentId,
    ) {}
}
