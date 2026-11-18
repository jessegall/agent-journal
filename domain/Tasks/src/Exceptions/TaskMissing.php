<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

final class TaskMissing extends RuntimeException implements CommandRefusal
{
    public static function forId(int $taskId): self
    {
        return new self("Task {$taskId} does not exist.");
    }
}
