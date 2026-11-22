<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

final class MonotonicClockWentBack extends LogicException
{
    public static function between(int $startNanoseconds, int $endNanoseconds): self
    {
        return new self("The monotonic clock went back from {$startNanoseconds} ns to {$endNanoseconds} ns.");
    }
}
