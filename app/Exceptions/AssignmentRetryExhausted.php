<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

final class AssignmentRetryExhausted extends RuntimeException
{
    public static function after(int $attempts, Throwable $lastFailure): self
    {
        return new self(
            "The assignment work met a conflicting change {$attempts} times in a row; read again and retry.",
            0,
            $lastFailure,
        );
    }
}
