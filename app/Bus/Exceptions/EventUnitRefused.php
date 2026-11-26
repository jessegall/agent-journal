<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

/**
 * The event unit of a transaction refuses to go on: a failure crossed one of its commands, so it may not commit, or
 * its batch was marked ready a second time.
 */
final class EventUnitRefused extends RuntimeException
{
    public static function failedBeforeCommit(string $command): self
    {
        return new self("{$command} cannot commit: a command or transaction listener of its transaction failed.");
    }

    public static function nothingPending(): self
    {
        return new self('The event unit was asked for a pending fact while none waits.');
    }

    public static function readyTwice(): self
    {
        return new self('The batch of an event unit was marked ready twice; a commit releases it once.');
    }
}
