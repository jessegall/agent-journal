<?php

declare(strict_types=1);

namespace App\Settings\Enums;

/**
 * What an actor may do with the journal settings.
 */
enum SettingAbility: string
{
    case Administer = 'administer';
}
