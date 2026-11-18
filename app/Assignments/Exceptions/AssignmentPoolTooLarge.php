<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A pool that would list more records than one pool may; it gives out none rather than a first part.
 */
final class AssignmentPoolTooLarge extends RuntimeException implements CommandRefusal
{
    public static function holding(string $record, int $largest): self
    {
        return new self("{$record} holds more than {$largest} records, more than one pool may list.");
    }
}
