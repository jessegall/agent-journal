<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

final class MessageMissing extends RuntimeException implements CommandRefusal
{
    public static function forId(string $messageId): self
    {
        return new self("Message {$messageId} does not exist.");
    }
}
