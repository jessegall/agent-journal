<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where a message stands: sent, waiting for an agent's answer, answered or dismissed.
 */
enum MessageState: string
{
    case Sent = 'sent';
    case WaitingForAnswer = 'waiting_for_answer';
    case Answered = 'answered';
    case Dismissed = 'dismissed';

    /**
     * Whether the message is closed: answered or dismissed, so it takes no further change.
     */
    public function isClosed(): bool
    {
        return $this === self::Answered || $this === self::Dismissed;
    }
}
