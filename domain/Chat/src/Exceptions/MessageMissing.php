<?php

declare(strict_types=1);

namespace Domain\Chat\Exceptions;

use RuntimeException;

final class MessageMissing extends RuntimeException
{
    public static function forId(int $messageId): self
    {
        return new self("Message {$messageId} does not exist.");
    }
}
