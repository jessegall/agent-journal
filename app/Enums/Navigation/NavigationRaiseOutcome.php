<?php

declare(strict_types=1);

namespace App\Enums\Navigation;

/**
 * What the journal answers a host that raised an uncertain point: a navigation request is open for it, the user
 * holds it as today, another runtime's open request of the same menu is answered first and the host asks again, or
 * the owner's library has an entry the host replays.
 */
enum NavigationRaiseOutcome: string
{
    case Opened = 'opened';
    case Held = 'held';
    case Wait = 'wait';
    case Entry = 'entry';
}
