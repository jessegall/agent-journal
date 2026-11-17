<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use RuntimeException;

final class MessageMissing extends RuntimeException
{
    public static function forId(int $messageId): self
    {
        return new self("Message {$messageId} does not exist.");
    }
}
