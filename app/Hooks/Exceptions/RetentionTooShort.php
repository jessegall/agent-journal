<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

final class RetentionTooShort extends LogicException
{
    public static function forDays(int $days, int $retrySeconds): self
    {
        return new self(
            "Hook calls kept for {$days} days would be pruned while a retry of {$retrySeconds} seconds is still accepted.",
        );
    }
}
