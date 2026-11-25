<?php

declare(strict_types=1);

namespace App\Enums\Navigation;

/**
 * Who answers a key script stopped on a menu it could not be certain of: the main desk's occupant through a
 * navigation request, or the user, who keeps today's hold, when the stopped runtime is the main desk occupant's own.
 */
enum NavigationAnswerer: string
{
    case MainInbox = 'main-inbox';
    case User = 'user';
}
