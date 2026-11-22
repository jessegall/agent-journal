<?php

declare(strict_types=1);

namespace App\Communication\Enums;

/**
 * What took one place in a chat inbox's timeline: a message, a member joining or leaving, the owner role passing on,
 * or the chat closing.
 */
enum TimelineEventType: string
{
    case Message = 'message';
    case Joined = 'joined';
    case Left = 'left';
    case Transferred = 'transferred';
    case Closed = 'closed';

    public function changesMembership(): bool
    {
        return $this !== self::Message;
    }
}
