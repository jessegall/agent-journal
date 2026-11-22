<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A task cannot start while a task it waits for is not finished and the wait is not waived; the message names the
 * prerequisites the caller may know of.
 */
final class TaskWaitsUnmet extends RuntimeException implements CommandRefusal
{
    /**
     * @param  list<string>  $prerequisites  such as 'task 24' or 'a removed task'
     */
    public static function forTask(int $number, array $prerequisites): self
    {
        $named = implode(', ', $prerequisites);

        return new self("Task {$number} cannot start yet: it waits for {$named}.");
    }
}
