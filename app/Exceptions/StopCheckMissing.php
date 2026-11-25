<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Exceptions\Concerns\ThrowsLater;
use LogicException;

/**
 * A stop attempt was named that the current session does not have: a reference is only ever made from one it opened.
 */
final class StopCheckMissing extends LogicException
{
    /** @use ThrowsLater<StopCheckMissing> */
    use ThrowsLater;

    public static function for(string $attemptId): self
    {
        return new self(sprintf('The current session has no stop attempt %s.', $attemptId));
    }
}
