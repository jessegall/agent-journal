<?php

declare(strict_types=1);

namespace App\Settings\Enums;

/**
 * Where a setting's current value comes from: its declared default, or an override someone stored.
 */
enum SettingSource: string
{
    case Default = 'default';
    case Override = 'override';
}
