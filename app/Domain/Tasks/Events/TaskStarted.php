<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Events;

use App\Core\Hooks\Storage\StackTarget;

/**
 * A task run started for an agent and session, raised inside the transaction that started it.
 */
final readonly class TaskStarted
{
    public function __construct(
        public int $taskId,
        public StackTarget $target,
    ) {}
}
