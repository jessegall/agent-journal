<?php

declare(strict_types=1);

namespace App\Domain\Chat\Api;

/**
 * One message of a conversation as a page may show it: its id, its body exactly as sent and where it stands.
 */
final readonly class MessageView
{
    public function __construct(
        public int $id,
        public string $body,
        public MessageState $state,
    ) {}
}
