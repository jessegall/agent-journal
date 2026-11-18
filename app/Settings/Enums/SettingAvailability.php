<?php

declare(strict_types=1);

namespace App\Settings\Enums;

/**
 * Whether a setting applies now: available, or not because its group is switched off or its group's switch is stored
 * wrongly.
 */
enum SettingAvailability: string
{
    case Available = 'available';
    case GroupDisabled = 'group_disabled';
    case GroupInvalid = 'group_invalid';
}
