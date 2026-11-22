<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where a message lives: desk mail between two inboxes, or a line in one chat inbox's timeline.
 */
enum MessageType: string
{
    case Desk = 'desk';
    case Chat = 'chat';

    /**
     * Whether the message lives in a chat, where the chat commands and their rules settle it, not the desk ones.
     */
    public function isChat(): bool
    {
        return $this === self::Chat;
    }
}
