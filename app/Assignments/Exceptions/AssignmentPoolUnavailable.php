<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A pool that gives out nothing now because the record it is about is not in a state that gives out work.
 */
final class AssignmentPoolUnavailable extends RuntimeException implements CommandRefusal
{
    public static function inState(string $record, string $state): self
    {
        return new self("{$record} is {$state}; its records are given out only while it is started.");
    }
}
