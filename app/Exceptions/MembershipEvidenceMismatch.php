<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Support\ActorIdentity;
use LogicException;

/**
 * A desk-only step was handed a chat membership, or a chat-only step a desk membership.
 */
final class MembershipEvidenceMismatch extends LogicException
{
    public static function notDesk(ActorIdentity $actor): self
    {
        return new self("The membership of {$actor->type->value}:{$actor->id} is a chat interval, not a desk seat.");
    }

    public static function notChat(ActorIdentity $actor): self
    {
        return new self("The membership of {$actor->type->value}:{$actor->id} is a desk seat, not a chat interval.");
    }
}
