<?php

declare(strict_types=1);

namespace App\Web\Policies;

use App\Actors\Contracts\Policy;
use App\Actors\Models\UserPresence;

/**
 * Who may work with presence: every granted actor, so the grants decide.
 */
final readonly class PresencePolicy implements Policy
{
    public static function model(): string
    {
        return UserPresence::class;
    }
}
