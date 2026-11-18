<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A change to a message that is already answered or dismissed.
 */
final class MessageStateConflict extends RuntimeException implements CommandRefusal
{
    public static function forMessage(int $number, string $state): self
    {
        return new self("Message {$number} is {$state} already, so it cannot change.");
    }
}
