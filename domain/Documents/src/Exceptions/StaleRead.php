<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A continued read of a record that has a newer revision than the read began on.
 */
final class StaleRead extends RuntimeException implements CommandRefusal
{
    public static function revision(int $expected, int $actual): self
    {
        return new self("The record is at revision {$actual} now, not {$expected}; read it again from the start.");
    }
}
