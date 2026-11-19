<?php

declare(strict_types=1);

namespace App\Communication\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with a message.
 */
enum MessageAbility: string implements DeclaresClassLevelAbilities
{
    case Send = 'send';
    case Answer = 'answer';
    case Dismiss = 'dismiss';
    case RequireAnswer = 'require-answer';
    case Work = 'work';

    /**
     * Whether only the actor the current round is addressed to may do it.
     */
    public function needsTheAddressee(): bool
    {
        return match ($this) {
            self::Send, self::RequireAnswer, self::Work => false,
            self::Answer, self::Dismiss => true,
        };
    }

    /**
     * Ordinary work in the area is decided on the model class alone; the other abilities on a record.
     */
    public function isClassLevel(): bool
    {
        return $this === self::Work;
    }
}
