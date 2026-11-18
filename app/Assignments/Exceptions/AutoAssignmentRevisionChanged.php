<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * An auto-assignment change made against a revision that is no longer the current one.
 */
final class AutoAssignmentRevisionChanged extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function for(int $expected, int $current): self
    {
        return new self(
            "The auto-assignment is at revision {$current}, not {$expected}; read it again before changing it.",
        );
    }

    protected function status(): int
    {
        return 409;
    }
}
