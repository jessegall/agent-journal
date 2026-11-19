<?php

declare(strict_types=1);

namespace App\Settings\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with the journal settings.
 */
enum SettingAbility: string implements DeclaresClassLevelAbilities
{
    case Administer = 'administer';

    /**
     * Each is decided on the model class alone, before the handler loads a record.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
