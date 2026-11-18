<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A draft edit against another version or editor than the draft has now.
 */
final class DraftConflict extends RuntimeException implements CommandRefusal
{
    public static function stale(int $expected, int $actual): self
    {
        return new self("The draft is at version {$actual}, not {$expected}; read it again and repeat the edit.");
    }

    public static function notYours(): self
    {
        return new self('This draft belongs to another editor or session; open your own draft.');
    }
}
