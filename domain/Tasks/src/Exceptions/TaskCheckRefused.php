<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A process run cannot become a check of a task run; the message is safe to show to whoever asked.
 */
final class TaskCheckRefused extends RuntimeException implements CommandRefusal
{
    public static function notYourRun(string $processRunId): self
    {
        return new self("Process run {$processRunId} was not opened by you, so it cannot check your task run.");
    }

    public static function alreadyRegistered(string $processRunId): self
    {
        return new self("Process run {$processRunId} already checks a task run.");
    }
}
