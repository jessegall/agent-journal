<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use RuntimeException;

/**
 * The plan cannot start in the state it is in; the message is safe to show to whoever asked.
 */
final class StartDenied extends RuntimeException
{
    public static function inState(string $state): self
    {
        return new self("This plan is {$state} and cannot start; only a planned plan starts.");
    }
}
