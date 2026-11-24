<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

/**
 * A direct chat was removed.
 */
final readonly class DirectChatRemoved extends ChatEvent
{
    public function __construct(
        public string $directChatId,
    ) {}
}
