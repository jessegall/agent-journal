<?php

declare(strict_types=1);

namespace App\Data\Messages;

/**
 * What reading one message did: whether this was its first read, and whether the reader took it up.
 */
final readonly class MessageReadResult
{
    public function __construct(
        public string $messageId,
        public bool $isFirstRead,
        public bool $isClaimed,
    ) {}
}
