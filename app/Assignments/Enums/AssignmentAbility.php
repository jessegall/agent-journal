<?php

declare(strict_types=1);

namespace App\Assignments\Enums;

use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with who holds a record: take it for itself, give it to another, or let it go.
 */
enum AssignmentAbility: string implements DeclaresClassLevelAbilities
{
    case Acquire = 'acquire';
    case Dispatch = 'dispatch';
    case Unassign = 'unassign';
    case Work = 'work';

    /**
     * The ability a write needs: taking a record for oneself acquires it, giving it to another dispatches it, and
     * no recipient lets it go.
     */
    public static function forRecipient(ActorIdentity $caller, ActorIdentity|null $recipient): self
    {
        if ($recipient === null) {
            return self::Unassign;
        }

        return $recipient->isSameAs($caller) ? self::Acquire : self::Dispatch;
    }

    /**
     * Ordinary work in the area is decided on the model class alone; the other abilities on a record.
     */
    public function isClassLevel(): bool
    {
        return $this === self::Work;
    }
}
