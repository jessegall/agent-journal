<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Exceptions;

use RuntimeException;

final class TaskMissing extends RuntimeException
{
    public static function forId(int $taskId): self
    {
        return new self("Task {$taskId} does not exist.");
    }
}
