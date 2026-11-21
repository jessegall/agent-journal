<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Support\ActorIdentity;
use App\Desks\Contracts\Desk;
use App\Desks\Models\DeskPreference;

/**
 * Makes a desk the one an actor prefers: their one preference switches to it, or is made the first time.
 */
final readonly class DeskPreferences
{
    public function prefer(ActorIdentity $actor, Desk $desk): DeskPreference
    {
        $preference = DeskPreference::lockedOf($actor);

        if ($preference === null) {
            return DeskPreference::create($actor, $desk);
        }

        $preference->switchTo($desk);

        return $preference;
    }
}
