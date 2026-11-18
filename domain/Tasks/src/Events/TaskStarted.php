<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Agents\Support\StackTarget;
use App\Contracts\Event;

/**
 * A task run started for an agent and session, raised inside the transaction that started it.
 */
final readonly class TaskStarted implements Event
{
    public function __construct(
        public string $taskId,
        public StackTarget $target,
    ) {}
}
