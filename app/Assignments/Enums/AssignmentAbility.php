<?php

declare(strict_types=1);

namespace App\Assignments\Enums;

use App\Actors\Support\ActorIdentity;

/**
 * What an actor may do with who holds a record: take it for itself, give it to another, or let it go.
 */
enum AssignmentAbility: string
{
    case Acquire = 'acquire';
    case Dispatch = 'dispatch';
    case Unassign = 'unassign';

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
}
