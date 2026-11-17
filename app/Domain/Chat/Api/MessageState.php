<?php

declare(strict_types=1);

namespace App\Domain\Chat\Api;

use App\Domain\Chat\MessageWorkState;

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
     * What the stack sees of the message in this state.
     */
    public function workState(): MessageWorkState
    {
        return match ($this) {
            self::WaitingForAnswer => MessageWorkState::Unanswered,
            self::Sent, self::Answered => MessageWorkState::Answered,
            self::Dismissed => MessageWorkState::Dismissed,
        };
    }
}
