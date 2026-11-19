<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A call failed with nothing a caller could act on; it is reported under the correlation id the caller is shown.
 */
final class CallFailedUnexpectedly extends RuntimeException
{
    public static function for(string $subject, string $correlationId, Throwable $failure): self
    {
        return new self("The call of {$subject} with correlation id {$correlationId} failed.", previous: $failure);
    }
}
