<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A refusal a middleware or handler gives, shown to the caller.
 */
final class CommandRefused extends RuntimeException implements CommandRefusal
{
    public static function because(string $reason): self
    {
        return new self("{$reason}");
    }
}
