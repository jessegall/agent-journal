<?php

declare(strict_types=1);

namespace App\Communication\Enums;

/**
 * What an actor may do with a message.
 */
enum MessageAbility: string
{
    case Send = 'send';
    case Answer = 'answer';
    case Dismiss = 'dismiss';
    case RequireAnswer = 'require-answer';

    /**
     * Whether only the actor the current round is addressed to may do it.
     */
    public function needsTheAddressee(): bool
    {
        return match ($this) {
            self::Send, self::RequireAnswer => false,
            self::Answer, self::Dismiss => true,
        };
    }
}
