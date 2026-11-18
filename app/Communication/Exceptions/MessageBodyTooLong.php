<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A message body over the size a message may have.
 */
final class MessageBodyTooLong extends RuntimeException implements CommandRefusal
{
    public static function forBytes(int $bytes): self
    {
        return new self("A message body is at most 65,536 bytes, not {$bytes}.");
    }
}
