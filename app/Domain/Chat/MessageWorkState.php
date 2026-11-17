<?php

declare(strict_types=1);

namespace App\Domain\Chat;

/**
 * Where a message to an agent stands, as the stack sees it.
 */
enum MessageWorkState: string
{
    case Unanswered = 'unanswered';
    case Answered = 'answered';
    case Dismissed = 'dismissed';

    public function needsReply(): bool
    {
        return $this === self::Unanswered;
    }
}
