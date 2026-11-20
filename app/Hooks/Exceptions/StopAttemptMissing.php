<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

/**
 * A stop attempt was named that the current session does not have: a reference is only ever made from one it opened.
 */
final class StopAttemptMissing extends LogicException
{
    public static function for(string $attemptId): self
    {
        return new self(sprintf('The current session has no stop attempt %s.', $attemptId));
    }
}
