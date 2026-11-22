<?php

declare(strict_types=1);

namespace Domain\Chat\Enums;

/**
 * Whether a chat still takes messages and members, or was closed for good.
 */
enum ConversationState: string
{
    case Open = 'open';
    case Closed = 'closed';

    public function isOpen(): bool
    {
        return $this === self::Open;
    }
}
