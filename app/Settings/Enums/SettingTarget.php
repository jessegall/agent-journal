<?php

declare(strict_types=1);

namespace App\Settings\Enums;

/**
 * What a settings change touched: one setting, or a group's switch.
 */
enum SettingTarget: string
{
    case Setting = 'setting';
    case Group = 'group';
}
