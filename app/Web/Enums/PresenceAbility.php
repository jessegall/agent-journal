<?php

declare(strict_types=1);

namespace App\Web\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

/**
 * What an actor may do with presence.
 */
enum PresenceAbility: string implements ClassLevelAbilities
{
    case Work = 'work';

    /**
     * Ordinary work is decided on the model class alone.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
