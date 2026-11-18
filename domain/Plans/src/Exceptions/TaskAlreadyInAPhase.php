<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use LogicException;

final class TaskAlreadyInAPhase extends LogicException
{
    public static function forTask(int $taskId): self
    {
        return new self("Task {$taskId} already sits in a phase; a task belongs to one phase at most.");
    }
}
