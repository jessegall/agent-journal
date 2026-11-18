<?php

declare(strict_types=1);

namespace Domain\Chat\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

final class MessageMissing extends RuntimeException implements CommandRefusal
{
    public static function forId(int $messageId): self
    {
        return new self("Message {$messageId} does not exist.");
    }
}
