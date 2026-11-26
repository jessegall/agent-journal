<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

final class RetentionTooShort extends LogicException
{
    public static function forDays(int $days, int $retrySeconds): self
    {
        return new self(
            sprintf(
                'Hook calls kept for %s days would be pruned while a retry of %s seconds is still accepted.',
                $days,
                $retrySeconds,
            ),
        );
    }
}
