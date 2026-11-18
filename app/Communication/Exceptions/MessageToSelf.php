<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * An actor sent a message to itself.
 */
final class MessageToSelf extends RuntimeException implements CommandRefusal
{
    public static function forActor(): self
    {
        return new self('A message goes to someone else: you cannot send one to yourself.');
    }
}
