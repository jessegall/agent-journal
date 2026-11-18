<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * An auto-assignment that names a pool no domain offers for its record type; the name is never looked up as a class.
 */
final class AutoAssignmentPoolUnknown extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function forType(string $assignableType): self
    {
        return new self("No domain offers that pool for {$assignableType}; list the pools of the type to choose one.");
    }

    protected function status(): int
    {
        return 422;
    }
}
