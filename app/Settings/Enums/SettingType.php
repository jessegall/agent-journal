<?php

declare(strict_types=1);

namespace App\Settings\Enums;

/**
 * The type of value a setting holds.
 */
enum SettingType: string
{
    case String = 'string';
    case Boolean = 'boolean';
    case Integer = 'integer';
    case Decimal = 'decimal';
    case Choice = 'choice';
}
