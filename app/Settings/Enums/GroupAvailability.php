<?php

declare(strict_types=1);

namespace App\Settings\Enums;

/**
 * Whether a group's settings apply: a plain group always, a group that can be switched off when on, and neither when
 * its stored switch is not a boolean.
 */
enum GroupAvailability: string
{
    case Always = 'always';
    case Enabled = 'enabled';
    case Disabled = 'disabled';
    case Invalid = 'invalid';
}
