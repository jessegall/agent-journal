<?php

declare(strict_types=1);

namespace App\Communication\Enums;

/**
 * Where a message to an agent stands, as the stack sees it.
 */
enum MessageWorkState: string
{
    case Unanswered = 'unanswered';
    case Answered = 'answered';
    case Dismissed = 'dismissed';

    /**
     * What the stack sees of a message in the given state.
     */
    public static function of(MessageState $state): self
    {
        return match ($state) {
            MessageState::WaitingForAnswer => self::Unanswered,
            MessageState::Sent, MessageState::Answered => self::Answered,
            MessageState::Dismissed => self::Dismissed,
        };
    }

    public function needsReply(): bool
    {
        return $this === self::Unanswered;
    }
}
