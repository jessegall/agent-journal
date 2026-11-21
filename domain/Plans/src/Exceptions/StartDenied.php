<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * The plan cannot start in the state it is in; the message is safe to show to whoever asked.
 */
final class StartDenied extends RuntimeException implements CommandRefusal
{
    public static function inState(int $number, string $state): self
    {
        return new self("Plan {$number} is {$state} and cannot start; only a planned plan starts.");
    }
}
