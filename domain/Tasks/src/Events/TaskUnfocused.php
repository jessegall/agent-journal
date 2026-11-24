<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * A task left its agent's focus: another task took it, or the task's work left the agent's stack. Raised only once
 * the change committed.
 */
final readonly class TaskUnfocused extends TaskEvent implements UserInterfaceUpdater
{
    public function __construct(
        public string $taskId,
        public string $agentId,
    ) {}
}
