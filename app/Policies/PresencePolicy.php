<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Authorization\OwnerPolicy;
use App\Models\Chats\UserPresence;

/**
 * Who may work with presence: every granted actor, so the grants decide.
 */
final readonly class PresencePolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return UserPresence::class;
    }
}
