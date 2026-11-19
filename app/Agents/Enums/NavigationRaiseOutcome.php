<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * What the journal answers a host that raised an uncertain point: a navigation request is open for it, the person
 * holds it as today, or another runtime's open request of the same menu is answered first and the host asks again.
 */
enum NavigationRaiseOutcome: string
{
    case Opened = 'opened';
    case Held = 'held';
    case Wait = 'wait';
}
