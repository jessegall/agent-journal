<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A wait between two tasks cannot change as asked; the message is safe to show to whoever asked.
 */
final class TaskWaitRefused extends RuntimeException implements CommandRefusal
{
    public static function onItself(int $number): self
    {
        return new self("Task {$number} cannot wait on itself.");
    }

    public static function wouldCycle(int $dependent, int $prerequisite): self
    {
        return new self(
            "Task {$dependent} cannot wait on task {$prerequisite}: task {$prerequisite} already waits on it.",
        );
    }

    public static function tooDeep(int $dependent): self
    {
        return new self("Task {$dependent} has too long a chain of waits to check for a cycle.");
    }

    public static function dependentEnded(int $number, string $state): self
    {
        return new self("Task {$number} is {$state}, so its waits no longer change.");
    }

    public static function dependentStarted(int $number): self
    {
        return new self("Task {$number} is being worked on, so it cannot start waiting now.");
    }

    public static function alreadyWaits(int $dependent, int $prerequisite): self
    {
        return new self("Task {$dependent} already waits on task {$prerequisite}.");
    }

    public static function noWait(int $dependent, int $prerequisite): self
    {
        return new self("Task {$dependent} does not wait on task {$prerequisite}.");
    }

    public static function alreadyWaived(int $dependent, int $prerequisite): self
    {
        return new self("The wait of task {$dependent} on task {$prerequisite} is already waived.");
    }
}
